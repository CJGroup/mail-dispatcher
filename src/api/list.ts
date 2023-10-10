import e from "express";

import { BookInfo, ListAPIBody, ListBatchAPIBody } from "../types";
import { addToList, getCount, getList, removeInList } from "../store";
import { adminMiddleware } from "../utils/auth";

const router = e.Router();

/**
 * @api {POST} /list/add 增加新成员
 * @apiVersion 2.4.0
 * @apiName Post AddMemberToList
 * @apiGroup 列表
 * @apiDescription 向列表中新增加成员
 * @apiBody {String} nickname 玩家昵称
 * @apiBody {String} mail 玩家邮件地址
 * @apiBody {String} [serverID] 服务器ID
 * @apiUse SuccessBase
 * @apiSuccess {Object} book 用户预约信息
 * @apiSuccess {Number} book.pos 当前用户在列表中的排名
 * @apiSuccess {Number} book.total 当前列表中的用户总数
 * @apiUse ErrorBase
 * @apiErrorExample {json} 403 邮件已存在
 * HTTP/1.1 403 Forbidden
 * {
 *    "code": 53,
 *    "message": "This Email is already in our list!"
 * }
 * @apiErrorExample {json} 400 缺失参数
 * HTTP/1.1 400 Bad Request
 * {
 *    "code": 40,
 *    "message": "Missing Params!"
 * }
 */
router.post("/add", async (req, res) => {
  const body = req.body as ListAPIBody;
  if ((await getList()).findIndex((val) => val.mail == body.mail) !== -1) {
    res.status(403).json({
      code: 53,
      message: "This Email is already in our list!",
    });
    return;
  }
  if (!body.nickname || !body.mail) {
    res.status(400).json({
      code: 40,
      message: "Missing Params!",
    });
    return;
  }
  await addToList({
    nickname: body.nickname,
    mail: body.mail,
    serverID: body.serverID,
  });
  const index = (await getList()).findIndex(
    (val) => body.mail === val.mail || body.nickname === val.nickname
  );
  res.status(200).json({
    code: 0,
    message: "Success!",
    book: {
      pos: index + 1,
      total: await getCount(),
    },
  });
});

/**
 * @api {POST} /list/add/batch 批量添加
 * @apiVersion 2.4.0
 * @apiName Post BatchAdd
 * @apiGroup 列表
 * @apiDescription 向列表中批量添加成员
 * @apiBody {Object[]} list 批量添加的成员列表
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 数据对象
 * @apiSuccess {Object[]} data.bookList 按照顺序返回的预订信息列表
 * @apiSuccess {Number} data.bookList.pos 当前用户在列表中的排名
 * @apiSuccess {Number} data.bookList.total 当前列表中的用户总数
 * @apiUse ErrorBase
 * @apiErrorExample {json} 403 邮件已存在
 * HTTP/1.1 403 Forbidden
 * {
 *    "code": 53,
 *    "message": "This Email is already in our list!"
 * }
 * @apiErrorExample {json} 400 缺失参数
 * HTTP/1.1 400 Bad Request
 * {
 *    "code": 40,
 *    "message": "Missing Params!"
 * }
 */
router.post("/add/batch", async (req, res) => {
  const body = req.body as ListBatchAPIBody;
  let isContinue: boolean = true;
  body.list.map(async (mem) => {
    if ((await getList()).findIndex((val) => val.mail === mem.mail) !== -1) {
      res.status(406).json({
        code: 53,
        message: "This Email is already in our list!",
      });
      isContinue = false;
    }
    if (!mem.nickname || !mem.mail) {
      res.status(400).json({
        code: 40,
        message: "Missing Params!",
      });
      isContinue = false;
    }
  });
  if (!isContinue) return;
  const bookList: BookInfo[] = [];
  for (const member of body.list) {
    addToList({
      nickname: member.nickname,
      mail: member.mail,
      serverID: member.serverID,
    });
    bookList.push({
      pos: (await getList()).findIndex(
        (val) => member.mail === val.mail || member.nickname === val.nickname
      ),
      total: await getCount(),
    });
  }
  res.status(200).json({
    code: 0,
    message: "success",
    data: {
      bookList,
    },
  });
});

/**
 * @api {GET} /list/get 获取列表
 * @apiVersion 2.4.0
 * @apiName Get List
 * @apiDescription 获取当前预约成员列表
 * @apiGroup 列表
 * @apiPermission 管理员
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 数据对象
 * @apiSuccess {Number} data.count 当前总用户数
 * @apiSuccess {Object[]} data.list 预约成员列表本体
 * @apiBody {String} data.list.nickname 玩家昵称
 * @apiBody {String} data.list.mail 玩家邮件地址
 * @apiBody {String} [data.list.serverID] 服务器ID
 */

router.get("/get", ...adminMiddleware, async (req, res) =>
  res
    .status(200)
    .json({
      code: 0,
      message: "success",
      data: {
        count: await getCount(),
        list: await getList(),
      },
    })
    .end()
);

/**
 * @api {GET} /list/get/self 获取预约信息
 * @apiVersion 2.4.0
 * @apiName Get SelfPositionInList
 * @apiDescription 获取提供的用户在列表中的位置
 * @apiGroup 列表
 * @apiQuery {String} nickname 用户昵称
 * @apiQuery {String} mail 用户邮箱
 * @apiQUery {String} [serverID] 用户服务器ID
 * @apiUse SuccessBase
 * @apiSuccess {Object} data 数据对象
 * @apiSuccess {Number} data.pos 当前用户在列表中的排名
 * @apiSuccess {Number} data.total 当前列表中的用户总数
 * @apiUse ErrorBase
 * @apiErrorExample {json} 404 未找到用户
 * HTTP/1.1 404 Not Found
 * {
 *    "code": 64,
 *    "message": "No this player in the list!"
 * }
 */
router.get("/get/self", async (req, res) => {
  if (!req.query.mail && !req.query.nickname) {
    res.status(500).json({
      code: 40,
      message: "Missing Params!",
    });
  } else {
    const index = (await getList()).findIndex(
      (val) =>
        req.query.mail === val.mail || req.query.nickname === val.nickname
    );
    if (index == -1) {
      res.status(404).json({
        code: 64,
        message: "No this player in the list!",
      });
    }
    res.status(200).json({
      code: 0,
      message: "success",
      data: {
        pos: index + 1,
        total: await getCount(),
      },
    });
  }
});

/**
 * @api {POST} /list/remove 移除成员
 * @apiVersion 2.4.0
 * @apiName Post RemoveListNumber
 * @apiDescription 从列表中移除成员
 * @apiGroup 列表
 * @apiPermission 管理员
 * @apiBody {String} nickname 玩家昵称
 * @apiBody {String} mail 玩家邮件地址
 * @apiBody {String} [serverID] 服务器ID
 * @apiUse ErrorBase
 * @apiUse SuccessBase
 */
router.post("/remove", ...adminMiddleware, async (req, res) => {
  const body = req.body as ListAPIBody;
  try {
    const num = (await getList()).findIndex(
      (value) => value.nickname === body.nickname && value.mail === body.mail
    );
    removeInList(num, 1);
    res.status(200).json({
      code: 0,
      message: "success",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 300,
      message: e,
    });
  }
});

export default router;
