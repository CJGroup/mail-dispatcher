import axios from "axios";
import {
  Express,
  NextFunction,
  Request,
  Response,
} from "express-serve-static-core";
import qs from "qs";
import { User } from "../db";
import { expressjwt } from "express-jwt";
import { JWT_SECRET, genToken } from "../utils";

declare module "express-serve-static-core" {
  interface Request {
    auth: Record<string, any>;
  }
}

export function initAuthentication(app: Express) {
  app.post("/login/feishu", async (req, res) => {
    try {
      const access_token = (
        await axios.post(
          "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal",
          JSON.stringify({
            app_id: "cli_a43ea6bb6bf8500e",
            app_secret: "xhZWnq1Sc2ak8ylcQavRFhmMPtzJNVCa",
          }),
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        )
      ).data.app_access_token;
      const data = (
        await axios.post(
          "https://open.feishu.cn/open-apis/authen/v1/access_token",
          JSON.stringify({
            grant_type: "authorization_code",
            code: req.body.code,
          }),
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        )
      ).data.data;
      if (data.tenant_key !== "172a7deb6e0a1758") {
        res.status(403).json({
          code: 35,
          message: "Your account is not in the SakuraRealm Organization.",
        });
      }
      const user = await User.findOne({
        where: { openID: data.open_id, unionID: data.union_id },
      });
      if (!user) {
        User.create({
          name: data.name,
          openID: data.open_id,
          unionID: data.union_id,
          tenant: "172a7deb6e0a1758",
          permission: 2,
        });
      }
      res.status(200).json({
        code: 0,
        message: "success",
        token: genToken(data.open_id, data.union_id),
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

export const authMiddleware: any[] = [
  expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
  async function (req: Request, res: Response, next: NextFunction) {
    const user = await User.findOne({
      where: {
        openID: req.auth.openID,
        unionID: req.auth.unionID,
      },
    });
    if (!user)
      res.status(401).json({
        code: 1,
        message: "Login needed!",
      });
    else if (user.permission || 1 <= 2)
      res.status(403).json({
        code: 3,
        message: "You have no permission!",
      });
    else next();
  },
];
