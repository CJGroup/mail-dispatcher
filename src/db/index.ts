import fs from "node:fs";
import * as os from "node:os";
import { resolve } from "node:path";

import { Sequelize } from "sequelize";

const path =
  os.platform() === "win32" ? "%APPDATALOCAL%/Saku-mailer" : "/data/app";
const filename = "storage.db";
const fullpath = resolve(path, filename);

if (!fs.existsSync(path)) fs.mkdirSync(path);

export const db = new Sequelize({
  dialect: "sqlite",
  storage: fullpath,
});

export * from './player';
