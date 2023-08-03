import * as fs from "node:fs";
import * as os from "node:os";
import { resolve } from "node:path";

import { Sequelize } from "sequelize";

// const path =
// // @ts-ignore
//   os.platform() === "win32" ? resolve(process.env.APPDATA, './saku-mailer') : "/data/app";
// const filename = "storage.db";
// const fullpath = resolve(path, filename);

// if (!fs.existsSync(path)) fs.mkdirSync(path);

export const db = new Sequelize({
  dialect: "mysql",
  host: 'mysql',
  port: 3306,
  database: 'mail',
  username: 'mail',
  password: 'SakuraMail',
  logging: false,
});