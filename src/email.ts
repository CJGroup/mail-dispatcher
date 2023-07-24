import { createTransport } from "nodemailer";
import path, { resolve } from "node:path";
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
    from: '芸樱绘境 oasis-auth@dm.sakura-realm.ink',
    subject: '幻想绘境 · 入服邀请函'
});

export function sendEmail(addr:string, nickname?: string){
    const file = fs.readFileSync(resolve(__dirname,'../mail.html'),'utf-8');
    const template = Hogan.compile(file);
    transporter.sendMail({
        to: addr,
        html: template.render({nickname:nickname?nickname:''}),
        attachments: [
            {
                filename: 'logo.png',
                path: 'http://www.data07.cn/assets/images/fantasyrealm.png',
                cid: 'Logo'
            }
        ]
    });
}