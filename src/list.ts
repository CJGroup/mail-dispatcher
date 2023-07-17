import * as fs from 'node:fs';
import { ListMember, Store } from './types';

function read(): Store{
    return JSON.parse(fs.readFileSync('/data/app/storage.json','utf-8'));
}
function write(obj:Record<string,any>){
    const str = JSON.stringify(obj);
    fs.writeFileSync('/data/app/storage.json',str,'utf-8');
}

export function addToList(mem: ListMember){   
    const store = read();
    store.idl++;store.count++;
    store.list.push({
        id: store.idl,
        nickname: mem.nickname,
        mail: mem.mail,
    });
    write(store);
}

export function getList(){
    return read().list;
}

export function getCount(){
    return read().count;
}

export function removeInList(start: number, count: number){
    const store = read();
    store.list.splice(start,count);
    write(store);
}
