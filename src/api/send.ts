import { Express } from "express-serve-static-core";
import { ListAPIBody, ListBatchAPIBody } from "../types";
import { sendEmail } from "../email";
import { authMiddleware } from "./auth";
import { Record } from "../db";

export function initSend(app: Express) {
  app.post("/send",
  ...authMiddleware,
  (req, res) => {
    const body = req.body as ListAPIBody;
    sendEmail(body.mail, body.nickname);
    Record.create({
      nickname: body.nickname,
      mail: body.mail,
    });
    res.status(200).json({
      code: 0,
      message: "success",
    });
  });

  app.post("/send/batch",
  ...authMiddleware,
  (req, res) => {
    const body = req.body as ListBatchAPIBody;
    for (const player of body.list) {
      sendEmail(player.mail, player.nickname);
      Record.create({
        nickname: player.nickname,
        mail: player.mail,
      });
    }
    res.status(200).json({
      code: 0,
      message: "success",
    });
  });
}
