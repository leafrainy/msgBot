import axios from 'axios';
import express from 'express';
const app = express();
app.use(express.json());
app.use('/docs', express.static('docs'));


//配置项
const WX_HOOK_KEY = process.env.WX_HOOK_KEY;

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;

const TG_HOOK_URL = "https://"+process.env.TG_HOOK_URL+'/tgwebhook';

const TG_CHAT_ID = process.env.TG_CHAT_ID;

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

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


/**
 * @api {POST} /sendwx 企业微信消息发送接口
 * @apiName sendwx
 * @apiGroup 发送消息
 * @apiBody  {String} message 消息内容
 * @apiBody  {String} [type='text'] 消息类型 默认text，可选markdown
 * @apiParamExample {json} Request-Example:
 *     {
 *       "message": "要发送的消息"
 *     }
 * @apiSuccess {Number} code 状态码 默认200
 * @apiSuccess {String} msg 发送状态 成功为SUCCESS 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "msg": "SUCCESS"
 *     }
 */
app.post('/sendwx', async (req, res) => {
  const { message , type } = req.body;  

  const msgStatus = await wxHookMsg(message,type);
  
  res.send({code:200,msg:msgStatus});
  
});

/**
 * @api {GET} /settghook telegram设置webhook
 * @apiName settghook
 * @apiGroup 设置
 * @apiSuccess {Number} code 状态码 默认200
 * @apiSuccess {String} msg 设置状态
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "msg": "something"
 *     }
 */
app.get('/settghook', async (req, res) => {

  const msgStatus = await tgSetHook();
  
  res.send({code:200,msg:msgStatus});
  
});

/**
 * @api {POST} /tgwebhook telegram webhook
 * @apiName tgwebhook
 * @apiGroup 设置
 * @apiSuccess {Number} code 状态码 默认200
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200
 *     }
 */
app.post('/tgwebhook', async (req, res) => {
  const chatId = req.body.message.chat.id;  
  const message = "你的chat_id为"+chatId;
  
  await tgHookMsg(message,chatId);
  
  res.sendStatus(200);
  
});

/**
 * @api {POST} /sendtg telegram消息发送接口
 * @apiName sendtg
 * @apiGroup 发送消息
 * @apiBody  {String} message 消息内容
 * @apiParamExample {json} Request-Example:
 *     {
 *       "message": "要发送的消息"
 *     }
 * @apiSuccess {Number} code 状态码 默认200
 * @apiSuccess {String} msg 发送状态 成功为SUCCESS 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "code": 200,
 *       "msg": "SUCCESS"
 *     }
 */
app.post('/sendtg', async (req, res) => {
  const { message } = req.body;  
  
  const msgStatus = await tgHookMsg(message);
  
  res.send({code:200,msg:msgStatus});
  
});

// 启动express server 
app.listen(80);
