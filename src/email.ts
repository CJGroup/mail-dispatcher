import { createTransport } from "nodemailer";
import path, { resolve } from "path";
import * as fs from 'node:fs';
import Hogan from 'hogan.js';

const transporter = createTransport({
    host: 'smtpdm.aliyun.com',
    port: 465,
    secure: true,
    auth: {
        user: 'oasis-auth@dm.sakura-realm.ink',
        pass: '2uLen6khqDrAz3Kh',
    }
},{
    from: 'oasis-auth@dm.sakura-realm.ink',
    sender: '芸樱绘境',
});

export function sendEmail(addr:string, nickname?: string){
    const file = fs.readFileSync(resolve(__dirname,'../mail.html'),'utf-8');
    const template = Hogan.compile(file);
    transporter.sendMail({
        to: addr,
        html: template.render({Player:nickname?nickname:'玩家'}),
        attachments: [
            {
                filename: 'logo.png',
                path: 'http://www.data07.cn/assets/images/yyhjlogo.png',
                cid: 'Logo'
            }
        ]
    });
}