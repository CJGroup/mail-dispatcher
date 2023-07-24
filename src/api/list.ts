import { Express } from "express-serve-static-core";

import { BookInfo, ListAPIBody, ListBatchAPIBody } from "../types";
import { addToList, getCount, getList, removeInList } from "../store";
import { authMiddleware } from "./auth";

export function initListAPI(app: Express) {
  app.post("/list/add", async (req, res) => {
    const body = req.body as ListAPIBody;
    if ((await getList()).findIndex((val) => val.mail == body.mail) !== -1) {
      res.status(403).json({
        code: 53,
        message: "This Email is already in our list!",
      });
      return;
    }
    if (!body.nickname || !body.mail) {
      res.status(400).json({
        code: 40,
        message: "Missing Params!",
      });
      return;
    }
    addToList({
      nickname: body.nickname,
      mail: body.mail,
      serverID: body.serverID,
    });
    const index = (await getList()).findIndex(
      (val) => body.mail === val.mail || body.nickname === val.nickname
    );
    res.status(200).json({
      code: 0,
      message: "Success!",
      book: {
        pos: index + 1,
        total: (await getCount()),
      },
    });
  });

  app.post("/list/add/batch", async (req, res) => {
    const body = req.body as ListBatchAPIBody;
    let isContinue: boolean = true;
    body.list.map(async (mem) => {
      if ((await getList()).findIndex((val) => val.mail === mem.mail) !== -1) {
        res.status(406).json({
          code: 53,
          message: "This Email is already in our list!",
        });
        isContinue = false;
      }
      if (!mem.nickname || !mem.mail) {
        res.status(400).json({
          code: 40,
          message: "Missing Params!",
        });
        isContinue = false;
      }
    });
    if (!isContinue) return;
    const bookList: BookInfo[] = [];
    for (const member of body.list) {
      addToList({
        nickname: member.nickname,
        mail: member.mail,
        serverID: member.serverID,
      });
      bookList.push({
        pos: (await getList()).findIndex(
          (val) => member.mail === val.mail || member.nickname === val.nickname
        ),
        total: (await getCount()),
      });
    }
    res.status(200).json({
      code: 0,
      message: "success",
      data: {
        bookList,
      },
    });
  });

  app.get("/list/get",
  ...authMiddleware,
  async (req, res) =>
    res
      .status(200)
      .json({
        code: 0,
        message: "success",
        data: {
          count: (await getCount()),
          list: (await getList()),
        },
      })
      .end()
  );

  app.get("/list/get/self", async (req, res) => {
    if (!req.query.mail && !req.query.nickname) {
      res.status(500).json({
        code: 40,
        message: "Missing Params!",
      });
    } else {
      const index = (await getList()).findIndex(
        (val) =>
          req.query.mail === val.mail || req.query.nickname === val.nickname
      );
      if (index == -1) {
        res.status(404).json({
          code: 64,
          message: "No this player in the list!",
        });
      }
      res.status(200).json({
        code: 0,
        message: "success",
        data: {
          pos: index + 1,
          total: (await getCount()),
        },
      });
    }
  });

  app.post("/list/remove",
  ...authMiddleware,
  async (req, res) => {
    const body = req.body as ListAPIBody;
    try {
      const num = (await getList()).findIndex(
        (value) => value.nickname === body.nickname && value.mail === body.mail
      );
      removeInList(num, 1);
      res.status(200).json({
        code: 0,
        message: "success",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        code: 300,
        message: e,
      });
    }
  });
}
