import { Express } from "express-serve-static-core";
import { PasswordLoginBody } from "../types";
import { User, db } from "../db";
import { JWT_SECRET, encrypt, genToken, verify } from "../utils";
import { v5 as UUID } from 'uuid';
import { expressjwt } from "express-jwt";
import { authMiddleware } from "./auth";

export async function initUser(app: Express) {
  {
    const users = await User.findAll({
        where: { name: 'admin', permission: 3 }
    });
    if( users.findIndex((val)=> verify("SakuraMail", val.password || '')) === -1 ) User.create({
        name: 'admin',
        password: encrypt("SakuraMail"),
        permission: 3,
    })
  }

  /**
   * @api /login/password 使用密码登录
   * @apiName Post LoginWithPassword
   * @apiDescription 使用传统的用户名+密码方式登录\n注意：内置超级管理员仅可通过此方式登录
   * @apiGroup 登录
   * @apiBody {String} username 用户名
   * @apiBody {String} password 密码
   * @apiUse SuccessBase
   * @apiSuccess {String} token 用于后续用户验证的token
   * @apiUse ErrorBase
   * @apiErrorExample {json}
   */
  app.post("/login/password", async (req, res, next) => {
    const body = req.body as PasswordLoginBody;
    if (!body.password || !body.username) {
      res.status(400).json({
        code: 40,
        message: "Missing Params!",
      });
      return next(new Error("Missing Params!"));
    }
    const user = (await User.findAll({
        where: {
            name: body.username,
        }
    })).find((val) => verify( body.password, val.password || ''));
    if(!user) {
        res.status(404).json({
            code: 300,
            message: "User not found!",
        });
        return next(new Error("User not found!"));
    }
    if(!user.unionID && !user.openID ) user.update({
        openID: UUID(body.username, UUID.DNS),
        unionID: UUID(body.username, UUID.DNS),
    });
    res.status(200).json({
      code: 0,
      message: "success",
      token: genToken(UUID(body.username, UUID.DNS), UUID(body.username, UUID.DNS)),
    });
  });

  /**
   * @api {POST} /admin/set/admin 设置管理员
   * @apiName Post SetAdmin
   * @apiDescription 将用户设置为管理员
   * @apiGroup 用户管理
   * @apiBody {String} openID 指定用户的openID
   * @apiBody {String} unionID 指定用户的unionID
   * @apiUse SuccessBase
   */
  app.post('/admin/set/admin', ...authMiddleware,(req, res, next)=>{
    
  })
}
