import express from "express";
import morgan from "morgan";
import cors from 'cors';

import { initListAPI } from "./list";
import { initAuthentication } from "./auth";
import { initSend } from "./send";


export function initBackend() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors({
    optionsSuccessStatus: 200,
  }));
  app.use('/doc',express.static('./doc'));

  app.get("/", (req, res) => res.redirect("http://www.data07.cn/#/hxhj"));
  initListAPI(app);
  initSend(app);
  initAuthentication(app);

  app.listen(80, () => {
    console.log("Start Listening on port 80!");
  });
}
