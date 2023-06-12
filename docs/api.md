---
outline: deep
---

## 接口调用说明

1.进入此处使用时代表你已经根据部署文档搭建成功

2.全部接口均为GET请求，目的是方便随时调用，不要再问为什么不支持POST

3.全部发信息接口，成功均返回如下response，未返回或者返回不同的就代表失败，自查原因或者提交issue

```json
{
    code:200,
    msg:"SUCCESS"
}
```
## 请求示例

假设你的域名是https://msgbot.com

### 1.企业微信

```js

https://msgbot.com/sendwx?message=你要发送的信息

```

### 2.微信测试号

```js

https://msgbot.com/sendwxtemp?message=你要发送的信息

```

### 3.telegram

```js

https://msgbot.com/sendtg?message=你要发送的信息

```

### 4.slack

```js

https://msgbot.com/sendslack?message=你要发送的信息

```

### 5.bark

```js

https://msgbot.com/sendbark?message=你要发送的信息&to=你的设备ID

```

