import e from "express";

import { ListAPIBody, ListBatchAPIBody } from "../types";
import { sendEmail } from "../email";
import { authMiddleware } from "./auth";
import { Record } from "../db";

const router = e.Router();

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
