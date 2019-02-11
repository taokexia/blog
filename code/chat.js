// 加载 net 模块，模块包含了 TCP 功能
var net = require('net');
// 创建 TCP 服务器
var chatServer = net.createServer();
// 定义数组用于保存链接
var clientList = [];
// 添加一个事件监听器
chatServer.on('connection', function(client) {
    // 定义连接客户端的姓名
    client.name = client.remoteAddress + ':' + client.remotePort;
    // 发送消息给客户端
    client.write('Hi!'+ client.name +'\n');
    // 保存连接
    clientList.push(client);
    // 监听收到数据的事件
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
// 推送消息
function broadcast(message, client) {
    // 检查 socket 的可写状态
    var cleanup = [];
    for(var i = 0; i < clientList.length; i++) {
        if(client !== clientList[i]) {
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