import axios from "axios";
import {
  Express,
  NextFunction,
  Request,
  Response,
} from "express-serve-static-core";
import qs from "qs";
import jwt from "jsonwebtoken";
import { User } from "../db";

declare module "express-serve-static-core" {
  interface Request {
    auth: Record<string, any>;
  }
}

export function initAuthentication(app: Express) {
  app.post("/login/feishu", async (req, res) => {
    try {
      const token = (
        await axios.post(
          "https://passport.feishu.cn/suite/passport/oauth/token",
          qs.stringify({
            grant_type: "authorization_code",
            client_id: "cli_a43ea6bb6bf8500e",
            client_secret: "xhZWnq1Sc2ak8ylcQavRFhmMPtzJNVCa",
            code: req.body.code,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
      ).data.access_token;
      const data = (
        await axios.get(
          "https://passport.feishu.cn/suite/passport/oauth/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      ).data;
      if (data.tenant_key !== "172a7deb6e0a1758") {
        res.status(403).json({
          code: 35,
          message: "Your account is not in the SakuraRealm Organization.",
        });
      }
      res.status(200).json({
        code: 0,
        message: "success",
        token: jwt.sign(
          {
            openID: data.open_id,
            unionID: data.union_id,
          },
          "SakuraRealm_Wuhen",
          {
            algorithm: "HS256"
          }
        ),
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        code: 50,
        message: e,
      });
    }
  });
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const user = await User.findOne({
        where:{
            openID: req.auth.openID,
            unionID: req.auth.unionID,
        }
    });
    if( !user ) res.status(401).json({
        code: 1,
        message: 'Login needed!',
    })
    else if( !user.admin ) res.status(403).json({
        code: 3,
        message: 'You have no permission!',
    })
    else next();
}
