import express from "express";
import morgan from "morgan";
import cors from 'cors';

import List from "./list";
import Send from "./send";
import Record from './record';
import User, { initUser } from './user';


export async function initBackend() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors({
    optionsSuccessStatus: 200,
  }));
  app.use('/doc',express.static('./doc'));

  app.get("/", (req, res) => res.redirect("http://www.data07.cn/#/server/hxhj"));
  app.use('/list', List);
  app.use('/send', Send);
  app.use('/user', User);
  await initUser();
  app.use('/record',Record);

  app.listen(80, () => {
    console.log("Start Listening on port 80!");
  });
}
