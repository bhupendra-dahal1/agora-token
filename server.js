const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');



const port = 3000; // You can use any port

// Agora Credentials
const appId = '5f81fd2819e74ac78cd2ba09bf94a9fd';
const appCertificate = 'd29de378e9b14f6db327742af815ae7d';
const app = express();

const nocache = (req, resp, next) =>{
    resp.header('Cache-console', 'private', 'np-cache', 'no-store', 'must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}
const generateAcessToken = (req, resp) =>{
    resp.header('Access-Control-Allow-Orgin', '*');
    const channelName = req.query.channelName;
    if (!channelName){
        return resp.status(500).json({'error': 'channel is required'});
    }
    let uid = req.query.uid;
    if(!uid || uid == ''){
        uid = 0;

    }
    let role = RtcRole.PUBLISHER;
    if(req.query.role == 'Publisher'){
        role = RtcRole.PUBLISHER;

    }
    let expireTime = req.query.expireTime;
    if(!expireTime || expireTime == ''){
        expireTime = 3600;
    } else{
        expireTime = parseInt(expireTime, 10);
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, privilegeExpireTime);
    return resp.json({'token':token});

    }



app.get('/agora_token', nocache, generateAcessToken );
app.listen(port, () => {
    console.log(`Agora token server running on http://localhost:${port}`);
});