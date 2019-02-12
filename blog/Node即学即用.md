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
    - [编写健壮的 Node 程序](#编写健壮的-node-程序)
        - [事件循环](#事件循环)
        - [模式](#模式)
        - [编写产品代码](#编写产品代码)
            - [差错处理](#差错处理)
            - [使用多处理器](#使用多处理器)
- [API和常用模块](#api和常用模块)
    - [核心 API](#核心-api)

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
Express 围绕着请求路由的方式支持 MVC 结构(模板、视图、控制器)。控制路由与控制器类似，提供了把数据模型和视图相结合的方法。
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
    var title = 'Chirpie';
    var header = 'Welcome to Chirpie';
    // 调用函数渲染模板
    res.render('index', {
        // 定义渲染的数据
        locals: {
            'title': title,
            'header': header,
            'tweets': tweets,
            'stylesheets': ['/public/style.css']
        }
    })
});
//  bodyParser 中间件，处理 POST 数据
app.post('/send', express.bodyParser(), function(req, res) {
    // 判断是否有数据
    if(req.body && req.body.tweet) {
        tweets.push(req.body.tweet);
        // 重定向网址
        if(acceptsHtml(req.headers['accept'])) {
            res.redirect('/', 302);
        } else {
            res.send({status:"ok", message: "Tweet received"});
        }
    } else {
        res.send({status:"nok", message:"No tweet received"})
    }
});
// 获取所有数据
app.get('/tweets', function(req, res) {
    res.send(tweets);
})
// 检查 accept 头是否包含 text/html
function acceptsHtml(header) {
    var accepts = header.split(',');
    for(var i = 0; i < accepts.length; i+= 0) {
        if(accepts[i] === 'text/html')
            return true;
    }
    return false;
}
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
// 创建新的 http 请求
var req = http.request(opts, function(res) {
    res.setEncoding('utf8');
    var data = "";
    res.on('data', function(d) {
        data += d;
    })
    res.on('end', function() {
        // 测试结果是否符合预期
        assert.strictEqual(data, '{"status": "ok", "message": "Tweet received"}');
    });
});
req.write('tweet=test');
req.end();
```
利用 assert 模块进行返回值测试

EJS布局模板文件 layout 文件定义了网站的主架，`<% %>` 标签之间的是js代码。

partial() 保存重复利用的代码片段。 body 变量包含我们有渲染的模板
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <%- partial('partials/stylesheet', stylesheets) %>
        <title><%= title %></title>
    </head>
    <body>
        <h1><%= header %></h1>
        <%- body %>
    </body>
</html>
```

index模板
```html
<form action="/send" method="POST">
    <input type="text" length="140" name="tweet">
    <input type="submit" value="Tweet">
</form>
<%- partial('partials/chirp', tweets) %>
```
chirp模板
```html
<p><%= chirp %></p>
<link rel="stylesheet" type="text/css" href="<%- stylesheet %>">
```

## 编写健壮的 Node 程序
### 事件循环
Node 的核心是事件循环。利用事件循环来处理系统各部分请求。Node 所有的 I/O 事件都是非阻塞的，所以 Node 会用到很多回调函数，但 Node 只以单线程运行。

Node 是一个非阻塞系统，当调用需要阻塞等待的数据库时，会采用回调函数替代闲置等待。
```js
var EE = require('events').EventEmitter;
var ee = new EE();
var die = false;

ee.on('die', function() {
    die = true;
})
setTimeout(function() {
    ee.emit('die');
}, 100);
while(!die) {

}
console.log('done');
```
`done`永远不会被输出，因为while不会让 Node 触发 setTimeout 回调。 Node 同时只能处理一件事。

编写 Node.js 服务器策略:
- 在设置完成后，所有操作都是事件驱动的
- 需要长时间处理数据，需要考虑把它分配给 web worker 处理。

### 模式
I/O 问题:
- 串行
- 并行： 可以解决无限延迟事件的影响
  - 有序: 嵌入函数
    ```js
    server.on('request', function(req, res) {
        // 获取 session 信息
        memcached.getSession(req, function(session) {
            // 从 db 获取信息
            db.get(session.user, function(userData) {
                // 其他服务器调用
                ws.get(req, function(wsData) {
                    // 渲染页面
                    page = pageRender(req, session, userData, wsData);
                    res.write('page');
                })
            })
        })
    });
    ```
  - 无序: 运行顺序不确定
    ```js
    fs.readFile('foo.txt', 'utf8', function(err, data) {
        console.log(data);
    });
    fs.readFile('bar.txt', 'utf8', function(err, data) {
        console.log(data);
    })
    ```

### 编写产品代码
#### 差错处理
JavaScript 提供了 try/catch 捕获错误，但在 Node 中，由于 I/O 隔离、异步调用，导致有些错误不会被捕获。通过 err 事件捕获 I/O 错误。
```javascript
req.on('error', function(e) {
    console.log('error');
})
```
#### 使用多处理器
Node 是当线程的。Node 提供了一个 cluster 模块，可以把任务分配给子进程，就是把当前程序复制一份到另一个进程(Windows上，其实是另外一个线程)。主进程管理所有子进程，但 I/O 操作相互独立。

```javascript
var cluster = require('cluster');
var http = require('http');
// 获得 CPU 数量
var numCPUs = require('os').cpus().length;
if(cluster.isMaster) {
    // 创建工作进程
    for(var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
        console.log('worker' + worker.pid + ' died');
    });
} else { // 可用 isWorker 判断
    // 工作进程创建 http 服务器
    http.Server(function(req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000); // 在启动一个 node 报 EADDRINUSE 端口已被使用
}
```
cluster 提供了跨平台时让许多个进程共享 socket 的方法。cluster还能做很多事，因为它是基于 `child_process` 模块的。提供一系列属性。

消息传递
```javascript
var rssWarn = (12 * 1024 * 1024);
var heapWarn = (10 * 1024 * 1024);
var workers = {};
if(cluster.isMaster) {
    // 创建工作进程
    for(var i = 0; i < numCPUs; i++) {
        // 创建进程
        createWorker();
    }
    // 循环判断 清楚运行时间过长的子进程
    setInterval(function() {
        var time = new Date().getTime();
        for(pid in workers) {
            if(workers.hasOwnProperty(pid) && workers[pid].lastCb + 5000 < time) {
                console.log('Long running worker' + pid + 'killed');
                workers[pid].worker.kill();
                delete workers[pid];
                createWorker();
            }
        }
    }, 1000);
} else { // 可用 isWorker 判断
    // 工作进程创建 http 服务器
    http.Server(function(req, res) {
        // 打乱 200 个请求的一个
        if(Math.floor(Math.random() * 200) === 4) {
            console.log('Stopped' + process.pid + 'from ever finishing');
            while(true) {continue};
        }
        res.writeHead(200);
        res.end("hello world from "+process.pid+"\n");
    }).listen(8000); // 在启动一个 node 报 EADDRINUSE 端口已被使用
    // 每秒报告一次
    setInterval(function report() {
        process.send({cmd: "reportMem", memory: process.memoryUsage(). process: process.pid});
    }, 1000);
}
function createWorker() {
    var worker = cluster.fork();
    console.log('Created Worker:' + worker.pid);
    // 允许开机时间
    workers[worker.pid] = {worker: worker, lastCb: new Date().getTime()+1000}
    worker.on('message', function(m) {
        if(m.cmd === 'reportMem') {
            workers[m.process].lastCb = new Date().getTime();
            if(m.memory) {
                if(m.memory.rss > rssWarn)
                    console.log('Worker '+m.process+' using too much memory');
            }
        }
    });
}
```
有一个风险是事件回调运行了很长时间，导致进程其他用户需要等待很长时间才能得到服务。唯一补救方法是杀掉工作进程，而这会丢失它正在执行工作。
# API和常用模块
## 核心 API