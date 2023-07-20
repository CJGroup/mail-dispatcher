import * as fs from "node:fs";
import * as os from "node:os";
import { resolve } from "node:path";

import { ListMember, Store } from "./types";

const path =
  os.platform() === "win32" ? "%APPDATALOCAL%/Saku-mailer" : "/data/app";
const filename = "storage.json";
const fullpath = resolve(path, filename);

function makePath() {
  if (fs.existsSync(path)) return;
  else fs.mkdirSync(path);
}

function read(): Store {
  makePath();
  if (!fs.existsSync(fullpath)) write({ count: 0, idl: 0, list: [] });
  return JSON.parse(fs.readFileSync(fullpath, "utf-8"));
}
function write(obj: Store) {
  const str = JSON.stringify(obj);
  fs.writeFileSync("/data/app/storage.json", str, {
    flag: "w+",
    encoding: "utf-8",
  });
}

export function addToList(mem: ListMember) {
  const store = read();
  store.idl++;
  store.count++;
  store.list.push({
    id: store.idl,
    nickname: mem.nickname,
    mail: mem.mail,
  });
  write(store);
}

export function getList() {
  return read().list;
}

export function getCount() {
  return read().count;
}

export function removeInList(start: number, count: number) {
  const store = read();
  store.list.splice(start, count);
  store.count -= count;
  write(store);
}
