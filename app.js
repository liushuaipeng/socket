var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var socketioJwt = require("socketio-jwt");
var jwt = require("jsonwebtoken");

var app = express();

var chatSocketMap = new Map();
var jwtSecret = "IM system by Xiao at 20171027";

app.use(express.static(path.join(__dirname, "www")));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/login", function(req, res) {
    if (chatSocketMap.get(req.body.userId)) {
        res.json({ code: "error", message: "该id已存在，请更改id！" });
    } else {
        var token = jwt.sign(req.body, jwtSecret, {
            expiresIn: 1800
        });
        res.json({ code: "success", message: "登陆成功！输入对方id，开始聊天吧！", token: token });
    }
});
app.set("port", 3000);

var server = http.createServer(app);

var socketIoChat = require("socket.io")(server, {
    path: "/chat"
});
socketIoChat.sockets
    .on(
        "connection",
        socketioJwt.authorize({
            secret: jwtSecret,
            timeout: 15000
        })
    )
    .on("authenticated", socket => {
        chatSocketMap.set(socket.decoded_token.userId, socket);
        socket.on("message/send", (msg, callback) => {
            var chatSocket = chatSocketMap.get(msg.toId);
            var resData = {
                date: new Date(),
                username: socket.decoded_token.username,
                msg: msg.msg
            };
            callback(resData);
            if (chatSocket) {
                chatSocket.emit("message/receive", resData);
            }
        });
    });

server.listen(3000, () => {
    console.log("正在运行...");
});
