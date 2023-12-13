import e from "express";
import axios from "axios";

import { PasswordLoginBody, UserSettingBody, User as UserInterface } from "../types";
import { JWT_SECRET, encrypt, genToken, verify } from "../utils";
import { v5 as UUID } from "uuid";
import { superAdminMiddleware } from "../utils/auth";
import { expressjwt } from "express-jwt";
import { User } from "../db";

const router = e.Router();

/**
 * @api {POST} /user/register 注册用户
 * @apiName Post Register
 * @apiDescription 注册新用户
 * @apiGroup 登录
 * @apiVersion 2.4.0
 * @apiBody {Object} data 用户信息
 * @apiBody {String} data.name 用户名
 * @apiBody {String} data.password 密码
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 */
router.post("/register", async (req, res, next) => {
  try {
    const body = req.body as UserInterface;
    const user = await User.findOne({
      where: {
        name: body.name,
      },
    });
    if (user) {
      res.status(403).json({
        code: 30,
        message: "User already exists!",
      });
      return next(new Error("User already exists!"));
    }
    await User.create({
      name: body.name,
      password: encrypt(body.password),
      openID: UUID(body.name, UUID.DNS),
      unionID: UUID(body.name, UUID.DNS),
      permission: 1,
    });
    res.status(200).json({
      code: 0,
      message: "success",
    });
  } catch (e) {
    res.status(500).json({
      code: 50,
      message: e,
    });
  }
});

/**
 * @api {POST} /user/login/feishu 飞书OAuth验证
 * @apiName Post FeishuOauth
 * @apiVersion 2.4.0
 * @apiGroup 登录
 * @apiDescription 飞书验证页面获取code后通过此API登录
 * @apiBody {String} code 飞书OAuth获取的code
 * @apiUse SuccessBase
 * @apiSuccess {String} token 返回的用于后续登录验证的token，
 * @apiUse ErrorBase
 * @apiErrorExample {json} 403 用户不在企业中
 * HTTP/1.1 403 Forbidden
 * {
 *      "code": 35,
 *      "message": "Your account is not in the SakuraRealm Organization."
 * }
 */
router.post("/login/feishu", async (req, res) => {
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
      await User.create({
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

/**
 * @api {POST} /user/login/password 使用密码登录
 * @apiName Post LoginWithPassword
 * @apiDescription 使用传统的用户名+密码方式登录
 * 注意：内置超级管理员仅可通过此方式登录
 * @apiGroup 登录
 * @apiVersion 2.4.0
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
router.post("/login/password", async (req, res, next) => {
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
 * @apiDescription 设置用户的权限等级
 * @apiGroup 用户管理
 * @apiPermission 超级管理员
 * @apiVersion 2.4.0
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
router.post(
  "/set/permission",
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
 * @api {GET} /user/list/get 获取用户列表
 * @apiName Get UserList
 * @apiDescription 获取当前系统内已经注册的所有用户的信息
 * @apiGroup 用户管理
 * @apiPermission 超级管理员
 * @apiVersion 2.4.0
 * @apiUse SuccessBase
 * @apiSuccess {Object[]} list 获取的用户列表
 * @apiSuccess {String} list.openID 用户的OpenID(不应该展示)
 * @apiSuccess {String} list.unionID 用户的UnionID(不应该展示)
 * @apiUse ErrorBase
 */
router.get("/list/get", ...superAdminMiddleware, async (req, res, next) => {
  try {
    const users = await User.findAll();
    const list = [];
    for (const user of users)
      list.push({
        openID: user.openID,
        unionID: user.unionID,
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

/**
 * @api {GET} /user/info/self 获取用户本人信息
 * @apiName Get UserSelfInfo
 * @apiDescription 获取当前登录用户的基本信息
 * @apiGroup 用户管理
 * @apiPermission 登录用户
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 当前用户信息
 * @apiSuccess {String} data.name 用户名
 * @apiSuccess {String} data.permission 用户的权限等级（1为普通用户，2为管理员，3为超级管理员）
 * @apiUse ErrorBase
 */
router.get(
  "/info/self",
  expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    const user = await User.findOne({
      where: {
        openID: req.auth.openID,
        unionID: req.auth.unionID,
      },
    });
    if (!user) {
      res.status(404).json({
        code: 40,
        message: "User not found!",
      });
      return next(new ReferenceError("User Not Found!"));
    }
    res.status(200).json({
      code: 0,
      message: "success",
      data: {
        name: user.name,
        permission: user.permission,
      },
    });
  }
);

/**
 * @api {GET} /user/info/get 获取指定用户信息
 * @apiName Get UserInfo
 * @apiDescription 获取指定用户的基本信息
 * @apiGroup 用户管理
 * @apiPermission 超级管理员
 * @apiVersion 2.4.0
 * @apiBody {Object} data 数据对象
 * @apiBody {String} data.openID 指定用户的openID
 * @apiBody {String} data.unionID 指定用户的unionID
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 当前用户信息
 * @apiSuccess {String} data.name 用户名
 * @apiSuccess {String} data.permission 用户的权限等级（1为普通用户，2为管理员，3为超级管理员）
 * @apiUse ErrorBase
 */
router.get("/info/get", ...superAdminMiddleware, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        openID: req.body.data.openID,
        unionID: req.body.data.unionID,
      },
    });
    if (!user) {
      res.status(404).json({
        code: 40,
        message: "User not found!",
      });
      return next(new ReferenceError("User Not Found!"));
    }
    res.status(200).json({
      code: 0,
      message: "success",
      data: {
        name: user.name,
        permission: user.permission,
      },
    });
  } catch (e) {
    res.status(500).json({
      code: 1,
      message: "Internal Server Error!",
    });
    return next(e);
  }
});

/**
 * @api {POST} /user/info/set 设置用户信息
 * @apiName Post SetUserInfo
 * @apiDescription 设置当前登录用户的基本信息
 * @apiGroup 用户管理
 * @apiPermission 登录用户
 * @apiVersion 2.4.0
 * @apiBody {Object} data 用户信息
 * @apiBody [String] data.name 用户名
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 */
router.post(
  "/info/set",
  expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          openID: req.auth.openID,
          unionID: req.auth.unionID,
        },
      });
      if (!user) {
        res.status(404).json({
          code: 40,
          message: "User not found!",
        });
        return next(new ReferenceError("User Not Found!"));
      }
      if (req.body.data.name) user.name = req.body.data.name;
      await user.save();
      res.status(200).json({
        code: 0,
        message: "success",
      });
    } catch (e) {
      res.status(500).json({
        code: 1,
        message: "Internal Server Error!",
      });
      return next(e);
    }
  }
);

/**
 * @api {POST} /user/password/self 修改当前用户密码
 * @apiName Post ChangePassword
 * @apiDescription 修改当前登录用户的密码
 * @apiGroup 用户管理
 * @apiPermission 登录用户
 * @apiVersion 2.4.0
 * @apiBody {Object} data 用户信息
 * @apiBody {String} data.oldPassword 旧密码
 * @apiBody {String} data.newPassword 新密码
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 */
router.post(
  "/password/self",
  expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          openID: req.auth.openID,
          unionID: req.auth.unionID,
        },
      });
      if (!user) {
        res.status(404).json({
          code: 40,
          message: "User not found!",
        });
        return next(new ReferenceError("User Not Found!"));
      }
      if (!verify(req.body.data.oldPassword, user.password || "")) {
        res.status(403).json({
          code: 30,
          message: "Wrong Password!",
        });
        return next(new Error("Wrong Password!"));
      }
      user.password = encrypt(req.body.data.newPassword);
      await user.save();
      res.status(200).json({
        code: 0,
        message: "success",
      });
    } catch (e) {
      res.status(500).json({
        code: 1,
        message: "Internal Server Error!",
      });
      return next(e);
    }
  }
);

/**
 * @api {POST} /user/password/set 设置用户密码
 * @apiName Post SetPassword
 * @apiDescription 设置指定用户的密码
 * @apiGroup 用户管理
 * @apiPermission 超级管理员
 * @apiVersion 2.4.0
 * @apiBody {Object} data 用户信息
 * @apiBody {String} data.openID 指定用户的openID
 * @apiBody {String} data.unionID 指定用户的unionID
 * @apiBody {String} data.password 新密码
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 */
router.post(
  "/password/set",
  ...superAdminMiddleware,
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          openID: req.body.data.openID,
          unionID: req.body.data.unionID,
        },
      });
      if (!user) {
        res.status(404).json({
          code: 40,
          message: "User not found!",
        });
        return next(new ReferenceError("User Not Found!"));
      }
      user.password = encrypt(req.body.data.password);
      await user.save();
      res.status(200).json({
        code: 0,
        message: "success",
      });
    } catch (e) {
      res.status(500).json({
        code: 1,
        message: "Internal Server Error!",
      });
      return next(e);
    }
  }
);

/**
 * @api {GET} /user/cancel 注销当前用户
 * @apiName Get CancelUser
 * @apiDescription 注销当前登录用户
 * @apiGroup 用户管理
 * @apiPermission 登录用户
 * @apiVersion 2.4.0
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 */
router.get("/cancel", expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }), async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        openID: req.auth.openID,
        unionID: req.auth.unionID,
      },
    });
    if (!user) {
      res.status(404).json({
        code: 40,
        message: "User not found!",
      });
      return next(new ReferenceError("User Not Found!"));
    }
    await user.destroy();
    res.status(200).json({
      code: 0,
      message: "success",
    });
  } catch(e) {
    res.status(500).json({
      code: 1,
      message: "Internal Server Error!",
    });
    return next(e);
  }
});

/**
 * @api {POST} /user/delete 删除指定用户
 * @apiName Post DeleteUser
 * @apiDescription 删除指定用户
 * @apiGroup 用户管理
 * @apiPermission 超级管理员
 * @apiVersion 2.4.0
 * @apiBody {Object} data 数据对象
 * @apiBody {String} data.openID 指定用户的openID
 * @apiBody {String} data.unionID 指定用户的unionID
 * @apiUse SuccessBase
 * @apiUse ErrorBase
 */
router.get("/delete", ...superAdminMiddleware, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        openID: req.body.data.openID,
        unionID: req.body.data.unionID,
      },
    });
    if (!user) {
      res.status(404).json({
        code: 40,
        message: "User not found!",
      });
      return next(new ReferenceError("User Not Found!"));
    }
    await user.destroy();
    res.status(200).json({
      code: 0,
      message: "success",
    });
  } catch (e) {
    res.status(500).json({
      code: 1,
      message: "Internal Server Error!",
    });
    return next(e);
  }
});

export async function initUser() {
  const users = await User.findAll({
    where: { name: "admin", permission: 3 },
  });
  if (users.findIndex((val) => verify("SakuraMail", val.password || "")) === -1)
    User.create({
      name: "admin",
      openID: UUID("admin", UUID.DNS),
      unionID: UUID("admin", UUID.DNS),
      password: encrypt("SakuraMail"),
      permission: 3,
    });
}

export default router;
