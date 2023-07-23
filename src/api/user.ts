import { Express } from "express-serve-static-core";
import { PasswordLoginBody } from "../types";
import { User, db } from "../db";
import { encrypt, verify } from "../utils";

export async function initUser(app: Express) {
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
      next(new Error("Missing Params!"));
    }
    const user = await User.findAll({
        where: {
            
        }
    })
  });
  if ((await User.findAll({ where: { name: "admin", password: encrypt("SakuraMail"), permission: 3 } })).length === 0)
    await User.create({
      name: "admin",
      password: encrypt("SakuraMail"),
      permission: 3,
    });
}
