import e from "express";
import { APIBody } from "./types";
import { sendEmail } from "./email";
import morgan from "morgan";

const app = e();

app.use(morgan("dev"));
app.use(e.json());

app.post('/',(req,res)=>{
    const body = req.body as APIBody;
    sendEmail(body.mail);
    res.status(200);
    res.end('success!');
})

app.listen(10010, ()=>{
    console.log('Start Listening on port 10010!');
});