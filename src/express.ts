import e from "express";
import { ListAPIBody, ListSendBody, User } from "./types";
import { sendEmail } from "./email";
import morgan from "morgan";

export function initBackend() {
  const app = e();

  const list: User[] = [];
  let count = 0;
  let idl = 0;

  app.use(morgan("dev"));
  app.use(e.json());

  app.all('*', (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  })

  app.get("/", (req, res) =>
    res.status(200).end("This is Sakurarealm mail system API.")
  );

  app.post("/list/add", (req, res) => {
    const body = req.body as ListAPIBody;
    if( list.findIndex((val) => val.mail == body.mail ) !== -1 ){
      res.status(500).json({
        code:53,
        message: "This Email is already in our list!"
      })
      return;
    }
    if( !body.nickname || !body.mail ){
      res.status(500).json({
        code:40,
        message: "Missing Params!"
      });
      return;
    }
    count++;idl++;
    list.push({
      id: idl,
      nickname: body.nickname,
      mail: body.mail,
    });
    const index = list.findIndex((val)=> body.mail === val.mail || body.nickname === val.nickname );
    res.status(200).json({
      code: 0,
      message: "Success!",
      book: {
        pos: index+1,
        total: count,
      }
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

  app.get("/list/get/self", (req, res)=>{
    if( !req.query.mail && !req.query.nickname ){
      res.status(500).json({
        code:40,
        message: "Missing Params!"
      });
    }else{
      const index = list.findIndex((val)=> req.query.mail === val.mail || req.query.nickname === val.nickname );
      if(index == -1){
        res.status(500).json({
          code:64,
          message: "No this player in the list!"
        })
      }
      res.status(200).json({
        code:0,
        message: "success",
        data:{
          pos: index,
          total: count,
        }
      })
    }
  })

  app.post("/list/remove", (req, res) => {
    const body = req.body as ListAPIBody;
    try {
      const num = list.findIndex(
        (value) => value.nickname === body.nickname && value.mail === body.mail
      );
      list.splice(num, 1);
      count--;
      res.status(200).end("Success!");
    } catch (e) {
      console.log(e);
      res.status(500).json({
        code: 300,
        message: e,
      })
    }
  });

  app.get("/list/send/all", (req, res) => {
    if(count === 0){
      res.status(500).json({
        code: 95,
        message: "No players on our list!",
      })
      return;
    }
    for (const user of list) {
      sendEmail(user.mail, user.nickname);
    }
    list.splice(0,list.length);
    res.status(200).json({
      code: 0,
      message: "success",
    })
  });

  app.post("/list/send", (req, res) => {
    const body = req.body as ListSendBody;
    if(body.number > count){
      res.status(500).json({
        code: 101,
        message: "the number you provided is larger than the players on our list!"
      })
      return;
    }
    for (let i = 0; i < body.number; i++) {
      const user = list[i];
      sendEmail(user.mail, user.nickname);
    }
    list.splice(0,body.number);
    res.status(200).json({
      code: 0,
      message: "success",
    })
  });

  app.listen(80, () => {
    console.log("Start Listening on port 80!");
  });
}
