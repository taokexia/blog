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

# API和常用模块