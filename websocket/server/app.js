/* Chat application  --- 聊天应用 */
var app = require('express')();
var http = require('http').Server(app);

/* 
这样就加载了 socket.io-client。 socket.io-client 暴露了一个 io 全局变量，然后连接服务器。
请注意我们在调用 io() 时没有指定任何 URL，因为它默认将尝试连接到提供当前页面的主机。
重新加载服务器和网站，你将看到控制台打印出 “a user connected”。
*/
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});

let count = 0; //记录当前用户连接的总数
//每当有用户连接的时候触发
io.on('connection', function (socket) {
    //每当有用户连接就自增 1
    count++;
    console.log('√有用户连接啦!-当前连接用户总数为:' + count + '位');

    //监听 聊天信息 事件
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        //为了简单起见，我们将消息发送给所有用户，包括发送者
        io.emit('chat message', msg);
    });

    //要将消息发给除特定 socket 外的其他用户，可以用 broadcast 标志：
    //socket.broadcast.emit('hi');

    //每个 socket 还会触发一个特殊的 disconnect 事件：用户断开连接的时候触发
    socket.on('disconnect', function () {
        count--;
        console.log('×有用户断开连接啦!-当前连接用户总数为:' + count + '位');
    });
});


//Socket.IO 的核心理念就是允许发送、接收任意事件和任意数据
//要将事件发送给每个用户，Socket.IO 提供了 io.emit 方法：
//io.emit('some event', { for: 'everyone' });


http.listen(3000, function () {
    console.log('listening on *:3000');
});