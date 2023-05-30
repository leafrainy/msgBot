import axios from 'axios';
import express from 'express';
const app = express();
app.use(express.json());


//配置项
const WX_HOOK_KEY = process.env.WX_HOOK_KEY;


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


// 消息发送接口
app.post('/send', async (req, res) => {
  const { message , type } = req.body;  

  const msgStatus = await wxHookMsg(message,type);
  
  res.send({code:200,msg:msgStatus});
  
});

// 启动express server 
app.listen(80);

