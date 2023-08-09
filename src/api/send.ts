import e from "express";

import { ListAPIBody, ListBatchAPIBody } from "../types";
import { sendEmail } from "../email";
import { authMiddleware } from "./auth";
import { Record } from "../db";

const router = e.Router();

/**
 * @api {POST} /send 直接发送邮件
 * @apiVersion 1.0.0
 * @apiName Post SendEmail
 * @apiDescription 直接向目标邮箱发送邮件
 * @apiGroup 直接发送
 * @apiPermission 管理员
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 */
router.post("/", ...authMiddleware, (req, res) => {
  const body = req.body as ListAPIBody;
  sendEmail(body.mail, body.nickname);
  Record.create({
    nickname: body.nickname,
    mail: body.mail,
    time: new Date(),
  });
  res.status(200).json({
    code: 0,
    message: "success",
  });
});

/**
 * @api {POST} /send/batch 直接批量发送邮件
 * @apiVersion 1.0.0
 * @apiName Post BatchSendEmail
 * @apiGroup 直接发送
 * @apiPermission 管理员
 * @apiDescription 批量直接向目标邮箱中发送邮件
 * @apiBody {Object[]} list 批量发送的邮箱列表
 * @apiBody {String} list.nickname 玩家昵称
 * @apiBody {String} list.mail 玩家邮件地址
 * @apiBody {String} [list.serverID] 服务器ID
 * @apiUse SuccessBase
 */
router.post("/batch", ...authMiddleware, (req, res) => {
  const body = req.body as ListBatchAPIBody;
  for (const player of body.list) {
    sendEmail(player.mail, player.nickname);
    Record.create({
      nickname: player.nickname,
      mail: player.mail,
      time: new Date(),
    });
  }
  res.status(200).json({
    code: 0,
    message: "success",
  });
});

export default router;
