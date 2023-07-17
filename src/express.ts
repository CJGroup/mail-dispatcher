import e from "express";
import { ListAPIBody, ListSendBody, User } from "./types";
import { sendEmail } from "./email";
import morgan from "morgan";

export function initBackend() {
  const app = e();

  app.all('*', (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  })

  const list: User[] = [];
  let count = 0;

  app.set('view engine', 'hogan.js')

  app.use(morgan("dev"));
  app.use(e.json());

  app.get("/", (req, res) =>
    res.status(200).end("This is Sakurarealm mail system.")
  );

  app.post("/list/add", (req, res) => {
    const body = req.body as ListAPIBody;
    count++;
    if( list.findIndex((val) => val.mail == body.mail ) !== -1 ){
      res.status(500).json({
        code:53,
        message: "This Email is already in our list!"
      })
    }
    list.push({
      id: count,
      nickname: body.nickname,
      mail: body.mail,
    });
    res.status(200).json({
      code: 0,
      message: "Success!",
    })
  });

  app.get("/list/get", (req, res) =>
    res
      .status(200)
      .json({
        code: 0,
        message: "success",
        data: {
          count: count,
          list: list,
        }
      })
      .end()
  );

  app.post("/list/remove", (req, res) => {
    const body = req.body as ListAPIBody;
    try {
      const num = list.findIndex(
        (value) => value.nickname === body.nickname && value.mail === body.mail
      );
      list.splice(num, 1);
      res.status(200).end("Success!");
    } catch (e) {
      console.log(e);
      res.status(500).end("Server Internal Error!");
    }
  });

  app.get("/list/send/all", (req, res) => {
    if(count === 0){
      res.status(500).json({
        code: 95,
        message: "No players on our list!",
      })
    }
    for (const user of list) {
      sendEmail(user.mail, user.nickname);
    }
    res.status(200).json({
      code: 0,
      message: "Success!",
    })
  });

  app.post("/list/send", (req, res) => {
    const body = req.body as ListSendBody;
    if(body.number > count){
      res.status(500).json({
        code: 101,
        message: "the number you provided is larger than the players on our list!"
      })
    }
    for (let i = 0; i < body.number; i++) {
      const user = list[i];
      sendEmail(user.mail, user.nickname);
    }
    res.status(200).json({
      code: 0,
      message: "Success!",
    })
  });

  app.listen(80, () => {
    console.log("Start Listening on port 80!");
  });
}
