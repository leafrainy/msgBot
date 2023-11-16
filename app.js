import axios from 'axios';
import express from 'express';
import apn from '@parse/node-apn';
import path from 'path';
const app = express();
app.use(express.json());

//配置项
const WX_APPID = process.env.WX_APPID;
const WX_APPSECRET = process.env.WX_APPSECRET;
const WX_OPENID = process.env.WX_OPENID;
const WX_TEMPLATEID = process.env.WX_TEMPLATEID;

const MYWX_HOOK_URL = process.env.MYWX_HOOK_URL;
const WX_HOOK_KEY = process.env.WX_HOOK_KEY;
const SLACK_HOOK_URL = process.env.SLACK_HOOK_URL;
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_HOOK_URL = "https://"+process.env.TG_HOOK_URL+'/tgwebhook';
const TG_CHAT_ID = process.env.TG_CHAT_ID;
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';


//个人微信发消息
async function myWxHookMsg(msg,to){
    
    var body =  {
        type:"Q0001",
        data:{
            wxid: to,
            msg: msg
        }
    }
    const res = await axios.post(MYWX_HOOK_URL,body)
    if(res.data.code==200){
        return "SUCCESS";
    }else{
        return "ERROR";
    }
    
}
// ios bark发送消息
async function apnMsg(msg,to){
	const filePath = path.join(process.cwd(), 'public', 'bark.p8');
	const options = {
	  token: {
	    key: filePath,
	    keyId: "LH4T9V5U4R",
	    teamId: "5U8LBRXG3A"
	  },
	  production: true
	};
	
	const apnProvider = new apn.Provider(options);
	var note = new apn.Notification();
	note.alert = {
		"title":"消息提醒",
		"body":msg
	};
	note.topic = "me.fin.bark";
	note.mutableContent = true;
	note.sound = "default";
	const res = await apnProvider.send(note, to).then( (result) => {
	  if(!result.failed.length){
		  return "SUCCESS";
	  }else{
		  return "ERROR";
	  }
	});
	
	return res;
}
//微信公众号 获取token
async function getAccessToken() {
  const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WX_APPID}&secret=${WX_APPSECRET}`);
  const accessToken = response.data.access_token;
  return accessToken;
}

//微信公众号 发送模板消息
async function sendTemplateMessage(data) {
  const accessToken = await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
  const postData = {
    touser: WX_OPENID,
    template_id: WX_TEMPLATEID,
    data: data
  };
  const response = await axios.post(url, postData);
  const result = response.data;
  if (result.errcode === 0) {
    return "SUCCESS";
  } else {
    return "ERROR";
  }
}

//telegram 设置webhook
async function tgSetHook(){
    const res = await axios.post(`${TELEGRAM_API_URL}${TG_BOT_TOKEN}/setWebhook`, {url: TG_HOOK_URL})
    if(res.data.ok){
        return res.data.description;
    }
}

//telegramwebhook调用
async function tgHookMsg(msg,chat_id=0){
    var body
    if(chat_id){
       body =  {
            chat_id: chat_id,
            text: msg
        } 
    }else{
        body =  {
            chat_id: TG_CHAT_ID,
            text: msg
        }
    }
    const res = await axios.post(`${TELEGRAM_API_URL}${TG_BOT_TOKEN}/sendMessage`,body)
    if(res.data.ok){
        return "SUCCESS";
    }else{
        return "ERROR";
    }
} 

//企业微信webhook调用
async function wxHookMsg(msg,type='text'){
    var body;

    const webhook = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${WX_HOOK_KEY}`;

    switch(type) {
        
        case "markdown":
            body = {
                msgtype: 'markdown',
                markdown: {
                    content: msg
                } 
            }
            break;
        default:
            body = {
                msgtype: 'text',
                text: {
                    content: msg
                } 
            }
    }
    const res= await axios.post(webhook, body);
    if(res.data.errcode){
        return res.data.errmsg;
    }else{
        return "SUCCESS";
    }
} 

//slack webhook调用
async function slackHookMsg(msg){
    const webhook = `${SLACK_HOOK_URL}`;
    const body = {
        text:msg
    }
    await axios.post(webhook, body);
    return "SUCCESS";
} 

//企业微信消息发送接口
app.get('/sendwx', async (req, res) => {
  const { message , type } = req.query;  
  const msgStatus = await wxHookMsg(message,type);
  res.send({code:200,msg:msgStatus});
});

// slack消息发送接口
app.get('/sendslack', async (req, res) => {
    const { message } = req.query;  
    const msgStatus = await slackHookMsg(message);
    res.send({code:200,msg:msgStatus});
  });

//telegram设置webhook
app.get('/settghook', async (req, res) => {
  const msgStatus = await tgSetHook();
  res.send({code:200,msg:msgStatus});
});

// telegram webhook
app.post('/tgwebhook', async (req, res) => {
  const chatId = req.body.message.chat.id;  
  const message = "你的chat_id为"+chatId;
  await tgHookMsg(message,chatId);
  res.sendStatus(200);
});

//telegram消息发送接口
app.get('/sendtg', async (req, res) => {
  const { message } = req.query;  
  const msgStatus = await tgHookMsg(message);
  res.send({code:200,msg:msgStatus});
});

//微信公众号消息发送接口
app.get('/sendwxtemp', async (req, res) => {
  const { message } = req.query;  
  const data = {
      "message": {
        "value": message
      }
    }
  const msgStatus = await sendTemplateMessage(data);
  res.send({code:200,msg:msgStatus});
});


//bark发送接口
app.get('/sendbark', async (req, res) => {
  const { message,to } = req.query;  
  const msgStatus = await apnMsg(message,to);
  res.send({code:200,msg:msgStatus});
  
});

//个人微信发消息
app.get('/sendmywx', async (req, res) => {
  const { to,message } = req.query;  
  const msgStatus = await myWxHookMsg(message,to);
  res.send({code:200,msg:msgStatus});
  
});

//启动express
app.listen(80);
