import express from "express";
import morgan from "morgan";
import { initListAPI } from "./list";
import { initAuthentication } from "./auth";
import { initSend } from "./send";


export function initBackend() {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use('/doc',express.static('./doc'));

  app.use((req, res, next)=>{
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Content-Type", "application/json;charset=utf-8");
      next();
  });

  app.get("/", (req, res) => res.redirect(""));
  initListAPI(app);
  initSend(app);
  initAuthentication(app);

  app.listen(80, () => {
    console.log("Start Listening on port 80!");
  });
}
