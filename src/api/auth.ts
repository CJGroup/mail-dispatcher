import axios from 'axios';
import { Express } from 'express-serve-static-core'
import qs from 'qs';

export function initAuthentication(app: Express){
    app.post('/login/feishu', async (req, res) => {
        const token = (await axios.post('https://passport.feishu.cn/suite/passport/oauth/token', qs.stringify({
            grant_type: 'authorization_code',
            client_id: 'cli_a43ea6bb6bf8500e',
            client_secret: 'xhZWnq1Sc2ak8ylcQavRFhmMPtzJNVCa',
            code: req.body.code,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })).data.access_token;
        const data = (await axios.get('https://passport.feishu.cn/suite/passport/oauth/userinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })).data;
        res.status(200).json({
            code: 0,
            message: 'success',
            
        })
    })
}