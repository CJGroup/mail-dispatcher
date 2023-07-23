import { Player } from "../db";
import { ListMember } from "../types";

export async function getList(){
    const list = await Player.findAll();
    const ret:ListMember[] = [];
    for(const ply of list) ret.push({
        nickname: ply.nickname,
        mail: ply.mail,
        serverID: ply.serverID,
    });
    return ret;
}

export async function addToList(player: ListMember){
    await Player.create({
        nickname: player.nickname,
        mail: player.mail,
        serverID: player.serverID,
    });
}

export async function getCount(){
    return (await Player.findAll()).length;
}

export async function removeInList(start: number, count: number){
    (await Player.findAll({
        offset: start,
        limit: count,
    })).map((player)=>{
        player.destroy();
    })
    Player.sync();
}