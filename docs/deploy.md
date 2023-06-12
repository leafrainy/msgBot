---
outline: deep
---

## 重要说明

搭建部署之前一定要先通读全文档！！！

搭建部署之前一定要先通读全文档！！！

搭建部署之前一定要先通读全文档！！！

## 一句话概括

本工具支持以下通道，无使用门槛（不需认证、备案、服务器白名单等等），注册就能用。有账号条件或者有需求的请继续浏览文档开始配置。

1.企业微信的微信群组机器人

2.微信公众号测试号的模板消息

3.telegram的Bot webhook

4.slack自建应用的 webhook

5.bark


## 前提物料

1.【必须】Vercel账号一枚

2.【必须】Github账号一枚

3.【非必须】域名一枚

4.【必须有其一】企业微信号、微信测试号、telegram账号、slack账号、bark应用（仅支持iOS端）

## 获取配置信息

### 1.企业微信相关

1.先通过三个成员号拉一个企业微信群组，拉完后不需要的人踢掉

2.【手机端设置方式】企业微信手机端点击右上角的【三个点】，找到【群机器人】，点击右上角【添加】-【添加】，设置心仪的名字和头像。返回上一层，看到刚创建的机器人，点击后可以看到【Webhook地址】，复制出来。留着key=后面的字符串备用

3.【电脑客户端设置方式】企业微信电脑端点击右上角的【三个点】，找到【添加群机器人】，点击【新创建一个机器人】，设置心仪的名字和头像。返回群组，看最右列，看到刚创建的机器人，点击后可以看到【webhook地址】，复制出来，留着key=后面的字符串备用

4.[点击前往官网参考文档](https://developer.work.weixin.qq.com/document/path/99110)

### 2.微信测试号相关

::: warning
先点击去官网查看是否有测试号资格，我是2015年左右就在玩了，不知道现在是否还开放申请
:::

1.[点击前往官网申请测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

2.进入后即可看到好多信息，找到【测试号二维码】，用你的手机扫描，可以看到右侧出现了你的昵称和微信号（一长串，这个叫做openid）。

3.继续向下一点点，找到【模板消息接口】，点击【新增测试模板】，模板标题随便填写，模板内容必须填写下面的内容

```js

提醒：{{message.DATA}}

```
添加完成后你会看到新产生了一个模板ID，和你刚才添加的模板内容

4.现在，请将当前页面上的appID，appsecret，刚才获取的长串微信号和模板ID，记录下来备用

### 3.telegram相关

1.[点击后与@BotFather对话创建Bot](https://t.me/botfather)

2.在对话框中输入`/newbot`根据提示创建自己的bot

3.创建完成后在 对话框中输入`/token`拿到机器人的token，记录下来备用

4.注意，此处还有一个参数名为chat_id.会在最后面获取

5.此处无官方文档，因为创建过程很简单，如果无法成功的话，请在搜索引擎自行搜索如何创建telegram bot

### 4.slack相关

1.[点击前往官网创建应用](https://yywthq.slack.com/intl/zh-cn/apps)

2.点击右上角【构建】，点击右上角【Your apps】，点击【manage your apps】，点击页面中间偏上的【Create New App】，根据提示设置。

3.设置完成后，点击你新建的 app名字，进入到管理页面。

4.点击左侧的【Incoming Webhooks】，进入页面后，点击页面中间偏上的【开关】激活，点击下面的【Add new webhook】按钮进行设置

5.设置完成后，此时拿到一个webhook url，记录下来备用

### 5.bark相关

1.[点击前往应用商店下载APP](https://apps.apple.com/cn/app/bark-%E7%BB%99%E4%BD%A0%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%91%E6%8E%A8%E9%80%81/id1403753865)

2.安装完后，进入右下角设置，找到【Device Token】，点击复制，记录下来备用

## 部署到Vercel

1.汇总配置信息，将上面你会用到的通道，需要记录的配置信息对号入座，点击第二步一键部署的时候会用的到

```shell

#企业微信
WX_HOOK_KEY = 企业微信群机器人的key
#微信测试号
WX_APPID = 第4步的appID
WX_APPSECRET = 第4步的appsecret
WX_OPENID = 第2步的openid
WX_TEMPLATEID = 第3步的模板id
#telegram
TG_BOT_TOKEN = 第3步的token
TG_HOOK_URL = 你搭建后的域名，搭建前必须准备好，比如 msgbot.com  不要加http等前后缀
TG_CHAT_ID = 你搭建后自动发送给你的chat_id，这里不用管，看最后的注意事项
#slack
SLACK_HOOK_URL = 第5步拿到的url

```

2.点击下面的一键部署按钮，根据提示，在【Configure Project】中填写对应的key值

<a href="https://vercel.com/import/git?s=https://github.com/leafrainy/shici&env=WX_HOOK_KEY&env=WX_APPID&env=WX_APPSECRET&env=WX_OPENID&env=WX_TEMPLATEID&env=TG_BOT_TOKEN&env=TG_HOOK_URL&env=TG_CHAT_ID&env=SLACK_HOOK_URL&project-name=msgBot&repository-name=for-msgBot" target="_blank">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>

3.以上部署完成，根据vercel提示绑定自己的域名即可。

4.绑定域名后，[点击前往查看接口文档](/api)

## 注意事项

### 1.telegram额外操作
1.假设你的最终域名是 https://msgbot.com，先用浏览器访问 https://msgbot.com/settghook 

2.此时你的机器人应该发给了你一句话：你的chat_id为：一串数字

3.在vercel后台，找到你刚部署好的项目，点进去后找到顶部的【settings】，找到左侧的【Environment Variables】，在输入框那，左侧填TG_CHAT_ID，右侧填你的数字，点击save

4.点击顶部的Deployments，找到刚才的部署记录，点击右侧的【三个竖点】，点击【Redeploy】，弹窗继续点击【Redeploy】