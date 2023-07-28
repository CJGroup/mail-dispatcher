import { Express } from "express-serve-static-core";
import { PasswordLoginBody, UserSettingBody } from "../types";
import { User, db } from "../db";
import { JWT_SECRET, encrypt, genToken, verify } from "../utils";
import { v5 as UUID } from "uuid";
import { authMiddleware, superAdminMiddleware } from "./auth";

export async function initUser(app: Express) {
  const users = await User.findAll({
    where: { name: "admin", permission: 3 },
  });
  if (users.findIndex((val) => verify("SakuraMail", val.password || "")) === -1)
    User.create({
      name: "admin",
      password: encrypt("SakuraMail"),
      permission: 3,
    });

  /**
   * @api /login/password 使用密码登录
   * @apiName Post LoginWithPassword
   * @apiDescription 使用传统的用户名+密码方式登录
   * 注意：内置超级管理员仅可通过此方式登录
   * @apiGroup 登录
   * @apiBody {String} username 用户名
   * @apiBody {String} password 密码
   * @apiUse SuccessBase
   * @apiSuccess {String} token 用于后续用户验证的token
   * @apiUse ErrorBase
   * @apiErrorExample {json} 400 参数缺失
   * HTTP/1.1 400 Bad Request
   * {
   *    "code": 40,
   *    "message": "Missing Params!",
   * }
   * @apiErrorExample {json} 404 未找到用户
   * HTTP/1.1 404 Not Found
   * {
   *    "code": 300,
   *    "message": "User not found!"
   * }
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
    const user = (
      await User.findAll({
        where: {
          name: body.username,
        },
      })
    ).find((val) => verify(body.password, val.password || ""));
    if (!user) {
      res.status(404).json({
        code: 300,
        message: "User not found!",
      });
      return next(new Error("User not found!"));
    }
    if (!user.unionID && !user.openID)
      user.update({
        openID: UUID(body.username, UUID.DNS),
        unionID: UUID(body.username, UUID.DNS),
      });
    res.status(200).json({
      code: 0,
      message: "success",
      token: genToken(
        UUID(body.username, UUID.DNS),
        UUID(body.username, UUID.DNS)
      ),
    });
  });

  /**
   * @api {POST} /user/set/permission 设置用户权限
   * @apiName Post SetAdmin
   * @apiDescription 将用户设置为管理员
   * @apiGroup 用户管理
   * @apiPermission 超级管理员
   * @apiBody {String} openID 指定用户的openID
   * @apiBody {String} unionID 指定用户的unionID
   * @apiBody {Number} permission 用户权限等级
   * @apiUse SuccessBase
   * @apiUse ErrorBase
   * @apiErrorExample {json} 404 用户未找到
   * HTTP/1.1 404 Not Found
   * {
   *    "code": 300,
   *    "message": "user not found"
   * }
   */
  app.post(
    "/user/set/permission",
    ...superAdminMiddleware,
    async (req, res, next) => {
      try {
        const body = req.body as UserSettingBody;
        const user = await User.findOne({
          where: {
            openID: body.openID,
            unionID: body.unionID,
          },
        });
        if (!user) {
          res.status(404).json({
            code: 300,
            message: "user not found",
          });
          return next(new Error("user not found"));
        }
        user.permission = body.permission;
        await user.save();
        res.status(200).json({
          code: 0,
          message: "success",
        });
      } catch (e) {
        res.status(500).json({
          code: 50,
          message: "Internal error occured!",
        });
        next(e);
      }
    }
  );

  /**
   * @api {GET} /user/get 获取用户列表
   * @apiName Get UserList
   * @apiDescription 获取当前系统内已经注册的所有用户的信息
   * @apiGroup 用户管理
   * @apiPermission 超级管理员
   * @apiUse SuccessBase
   * @apiSuccess {Object[]} list 获取的用户列表
   * @apiSuccess {String} list.name 用户名
   * @apiSuccess {String} list.openID 用户的OpenID(不应该展示)
   * @apiSuccess {String} list.unionID 用户的UnionID(不应该展示)
   * @apiSuccess {String} list.permission 用户的权限等级（1为普通用户，2为管理员，3为超级管理员）
   * @apiUse ErrorBase
   */
  app.get("/user/get", ...superAdminMiddleware, async (req, res, next) => {
    try {
      const users = await User.findAll();
      const list = [];
      for (const user of users)
        list.push({
          name: user.name,
          openID: user.openID,
          unionID: user.unionID,
          permission: user.permission,
        });
      res.status(200).json({
        code: 0,
        message: "success",
        list,
      });
    } catch (e) {
      res.status(500).json({
        code: 50,
        message: "internal error",
      });
      next(e);
    }
  });
}
