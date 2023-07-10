import { createTransport } from "nodemailer";
import { resolve } from "path";

const transporter = createTransport({
    host: 'smtpdm.aliyun.com',
    port: 465,
    secure: true,
    auth: {
        user: 'oasis-auth@dm.sakura-realm.ink',
        pass: '2uLen6khqDrAz3Kh',
    }
},{
    from: 'oasis-auth@dm.sakura-realm.ink'
});

export function sendEmail(addr:string, nickname?: string){
    transporter.sendMail({
        to: addr,
        html: {
            path: resolve(__dirname,'../mail.html')
        },
        attachments: [
            {
                filename: 'logo.png',
                path: 'http://www.data07.cn/assets/images/yyhjlogo.png',
                cid: 'Logo'
            }
        ]
    });
}