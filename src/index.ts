import e from "express";
import { ListAPIBody, ListSendBody, User } from "./types";
import { sendEmail } from "./email";
import morgan from "morgan";

const app = e();

const list: User[] = [];
let count = 0;

app.use(morgan("dev"));
app.use(e.json());

app.get('/',(req,res) => res.status(200).end('This is Sakurarealm mail system.'))

app.post('/list/add', (req, res)=>{
    const body = req.body as ListAPIBody;
    count++;
    list.push({
        id: count,
        nickname: body.nickname,
        mail: body.mail,
    });
    res.status(200).end('Success!');
})

app.get('/list/get', (req, res) => res.status(200).json({
    count: count,
    list: list,
}).end());

app.post('/list/remove', (req, res) => {
    const body = req.body as ListAPIBody;
    try{
        const num = list.findIndex((value) => value.nickname === body.nickname && value.mail === body.mail );
        list.splice(num,1);
        res.status(200).end('Success!');
    }catch(e){
        console.log(e);
        res.status(500).end('Server Internal Error!');
    }
})

app.get('/list/send/all', (req, res)=>{
    for(const user of list){
        sendEmail(user.mail, user.nickname);
    }
})

app.post('/list/send', (req, res)=>{
    const body = req.body as ListSendBody;
    for(let i=0;i<body.number;i++){
        const user = list[i];
        sendEmail(user.mail, user.nickname);
    }
})

app.listen(80, ()=>{
    console.log('Start Listening on port 80!');
});