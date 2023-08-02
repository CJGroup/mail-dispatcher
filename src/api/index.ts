import express from "express";
import morgan from "morgan";
import cors from 'cors';

import List from "./list";
import { initAuthentication } from "./auth";
import { initSend } from "./send";
import Record from './record';


export function initBackend() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors({
    optionsSuccessStatus: 200,
  }));
  app.use('/doc',express.static('./doc'));

  app.get("/", (req, res) => res.redirect("http://www.data07.cn/#/server/hxhj"));
  app.use('/list', List);
  initSend(app);
  initAuthentication(app);
  app.use('/record',Record);

  app.listen(80, () => {
    console.log("Start Listening on port 80!");
  });
}
