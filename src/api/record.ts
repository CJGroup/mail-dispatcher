import { Router } from "express";
import { authMiddleware } from "./auth";
import { Record } from "../db";

const router = Router();

router.use(...authMiddleware);

/**
 * @api {GET} /record/get 获取邮件发送记录
 * @apiName Get GetSendRecords
 * @apiDescription 获取通过/send系列API发送邮件的记录
 * @apiVersion 1.0.0
 * @apiGroup 发送记录
 * @apiPermission 管理员
 * @apiUse SuccessBase
 * @apiSuccess {Object[]} list 获取的记录列表
 * @apiSuccess {String} list.nickname 记录中的玩家昵称
 * @apiSuccess {String} list.mail 记录中的邮箱地址
 * @apiSuccess {String} list.time 记录中的时间
 * @apiUse ErrorBase
 */
router.get("/get", async (req, res, next) => {
  try {
    const rlist = await Record.findAll({
      order: [["id","DESC"]],
    });
    const list = [];
    for (const rec of rlist) {
      list.push({
        nickname: rec.nickname,
        mail: rec.mail,
        time: rec.time.toISOString(),
      });
    }
    res.status(200).json({
      code: 0,
      message: "success",
      list,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
