import { Express } from "express-serve-static-core";
import { ListAPIBody, ListBatchAPIBody } from "../types";
import { sendEmail } from "../email";
import { authMiddleware } from "./auth";

export function initSend(app: Express) {
  app.post("/send",
  ...authMiddleware,
  (req, res) => {
    const body = req.body as ListAPIBody;
    sendEmail(body.mail, body.nickname);
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
    }
    res.status(200).json({
      code: 0,
      message: "success",
    });
  });
}
