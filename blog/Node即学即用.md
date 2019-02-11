<!-- TOC -->

- [基础入门](#基础入门)
    - [简介](#简介)
        - [Linux 下安装 Node.js](#linux-下安装-nodejs)
        - [Node REPL](#node-repl)
        - [服务器程序](#服务器程序)
        - [高性能 Web 服务器](#高性能-web-服务器)
    - [编写有趣的应用](#编写有趣的应用)
        - [创建一个聊天服务器](#创建一个聊天服务器)
        - [编写一个 Twitter](#编写一个-twitter)
- [API和常用模块](#api和常用模块)

<!-- /TOC -->

# 基础入门
## 简介
> Node 是对高性能 V8 引擎的封装，通过提供一系类优化的 API 类库，使得 V8 在浏览器之外依然能高效运行。

Node 的特性是对高性能的追求。采用了编译领域最新技术。使得 JavaScript 等高级语言编写的代码在运行效率上能够接近用 C 等底层语言编写的代码，并且开发成本有所降低。

Node 利用了 JavaScript 的事件驱动(event-driven)构建服务器程序。用事件循环(event loop)架构，使得开发变得简单和安全。提供了一系列非阻塞函数库来支持事件循环特性。

Node 另一强大特性是能在服务器端运行 JavaScript。降低开发成本。

### Linux 下安装 Node.js
> Node.js 版本号依照C的习惯: 主版本.次版本.补丁。稳定版本的次版本是偶数，开发版本的次版本号是奇数。

Linux命令: 采用 configure/make 方法
```
tar xzf node-v0.6.6.tar.gz
cd node-v0.6.6
./configure
make
// 为全部用户安装
sudo make install
// 安装到本地用户
mkdir ~/local
./configure --prefix=~/local
```
### Node REPL
Node.js 提供了 REPL 模式(Read-Evaluate-Print-Loop, 输入-求值-输出-循环)，即交互式命令解析器。可以利用 Node 解析器测试代码，也可以用来测试js文件 `node filename.js`。

为了更好使用，提供了以点号(.)开头的元命令。如 `.help` 会显示帮助菜单; `.clear` 清除当前运行内容; `.exit` 将退出 Node 解析器。

使用解析器时，输入变量的名称就会在终端显示其内容，Node 会智能地显示复杂对象。如果对象是函数，会直接显示`[Function]`，避免因函数过长而导致刷屏。

### 服务器程序
Node.js 的首要应用是服务器程序。Node 除了用 V8 引擎来解析 JavaScript 外，还提供了高度优化的应用库，用来提高服务器效率。HTTP 模块是专为快速非阻塞式 HTTP 服务器而用 C 重新编写的。
```javascript
var http = require('http');
http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124');
```
Node 用的是 CommonJS 模块风格。 Node 本身就是 Web 服务器。调用 HTTP 模块工厂模式方法(createServer) 创建新的 HTTP 服务器， 并监听 8124 端口。在 createServer时，传入匿名函数为参数，此函数绑定在新创建服务器事件监听器上进行 request 事件处理，监听访问请求，该类方法又称回调(callback)。

`res.writeHead` 设置HTTP响应头; `res.end` 把内容发送给客户端后关闭 HTTP连接。

### 高性能 Web 服务器
Node 给服务器程序开发领域引进了**事件驱动编程**。Node 在同一程序内服务所有用户。当 Node 需要等待一些费时操作时， 它就继续处理下一个用户的请求，这种方式能够更高效的应用内存，加快服务。

## 编写有趣的应用
Node 开发网络应用需要许多 I/O 操作。

### 创建一个聊天服务器
需要在 Node 中使用 TCP 模块，并创建 TCP 服务器
```js
// 加载 net 模块，模块包含了 TCP 功能
var net = require('net');
// 创建 TCP 服务器
var chatServer = net.createServer();
// 定义数组用于保存链接
var clientList = [];
// 添加一个事件监听器
chatServer.on('connection', function(client) {
    // 定义连接客户端的姓名
    // remoteAddress 是客户端所在的IP地址
    // remotePort 是客户端接收从服务器返回数据的 TCP 端口
    client.name = client.remoteAddress + ':' + client.remotePort;
    // 发送消息给客户端
    client.write('Hi!'+ client.name +'\n');
    // 保存连接
    clientList.push(client);
    // 监听收到数据的事件，client发送数据到服务器时触发
    client.on('data', function(data) {
        broadcast(data, client);
    });
    // 监听客户端断线的事件
    client.on('end', function() {
        // 数组中去掉保存的已经断开的链接
        clientList.splice(clistList.indexOf(client), 1);
    });
    client.on('error', function(e) {
        // 记录错误
        console.log(e);
    })
});
// 推送消息给所有客户端
function broadcast(message, client) {
    // 检查 socket 的可写状态，更加保险
    var cleanup = [];
    for(var i = 0; i < clientList.length; i++) {
        // 向别的客户端转发消息
        if(client !== clientList[i]) {
            // 判断当前客户端是否可以可写
            if(clientList[i].writable) {
                clientList[i].write(client.name + 'says' + message);
            } else {
                cleanup.push(clientList[i]);
                // 销毁链接
                clientList[i].destroy();
            }
        }
    }
    // 在写入循环中删除死节点，消除垃圾索引
    for(var i = 0;i < cleanup.length; i++) {
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}
chatServer.listen(9000);
```
链接服务器触发回调函数时，会传给我们新客户端所对应的 TCP socket 对象的引用，即 client。

在 Linux 上使用 telnet 进行连接,模拟客户端，得到返回的结果。window 上推荐使用 putty
```
telnet 127.0.0.1 9000
```
之后便可以发送消息给客户端转发。

> JavaScript 无法很好处理二进制数据，所以 Node 特地增加了一个 Buffer 库来帮助服务器。Node 默认保存原始二进制格式。可以通过`toString()` 把 Buffer 数据翻译为可读的字符串。
### 编写一个 Twitter
Express 模块针对 Node 的 Web 框架为现有的 http 服务器模块添加了更多扩展(MVC),使开发更加简单。

安装 express 模块
```
npm install express
```

Express 应用基本文件结构
```
├── app.js
├── public
└── views
    └── partials
```
Express 会在后台调用 http 模块。

app.js文件代码:
```js
var express = require('express');
// 创建服务器
var app = express.createServer();
// 监听指定端口
app.listen(8000);

var tweets = [];

app.get('/', function(req, res) {
    res.send('Welcome to Node Twitter');
});
//  bodyParser 中间件，处理 POST 数据
app.post('/send', express.bodyParser(), function(req, res) {
    // 判断是否有数据
    if(req.body && req.body.tweet) {
        tweets.push(req.body.tweet);
        res.send({status:"ok", message: "Tweet received"});
    } else {
        res.send({status:"nok", message:"No tweet received"})
    }
});
// 获取所有数据
app.get('/tweets', function(req, res) {
    res.send(tweets);
})
```
`express.bodyParser()` 中间件，处理 POST 数据,要求请求头 `content-type`属性是 `application/x-www-form-urlencoded`或`application/json`。保持到 `req.body` 中。

测试 POST API
```js
var http = require('http');
// 利用 assert 模块进行测试
var assert = require('assert');
var opts = {
    host: 'localhost',
    port: 8000,
    path: '/send',
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'}
};
var req = http.request(opts, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(d) {
        data += d;
    })
    res.on('end', function() {
        assert.strictEqual(data, '{"status": "ok", "message": "Tweet received"}');
    });
});
req.write('tweet=test');
req.end();
```
# API和常用模块