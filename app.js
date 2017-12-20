var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path = require("path");
var http = require("http");
var socketioJwt = require("socketio-jwt");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var jwt = require("jsonwebtoken");

var app = express();
// es6中的Map()对象，和普通的Object区别：
// Object只接受字符串做为key，Map数据结构则提供各种类型（对象，dom节点）都可以做为key
// 具体可以查看阮一峰的es6入门  http://es6.ruanyifeng.com/?search=map&x=0&y=0#docs/set-map#Map
var chatSocketMap = new Map();
// 加密所使用的秘钥
var jwtSecret = "IM system by Xiao at 20171118";

mongoose.connect("mongodb://127.0.0.1/xiaosocket", {
    useMongoClient: true
});
var mongoStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 5
});
app.use(
    session({
        // 用来加密 sessionID
        secret: "xiao im system 666!",
        resave: false,
        saveUninitialized: true,
        store: mongoStore

        // name: 设置 cookie 中，保存 session 的字段名称，默认为 connect.sid 。
        // store: session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。Express 生态中都有相应模块的支持。
        // secret: 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
        // cookie: 设置存放 session id 的 cookie 的相关选项，默认为(default: { path: '/', httpOnly: true, secure: false, maxAge: null })
        // genid: 产生一个新的 session_id 时，所使用的函数， 默认使用 uid2 这个 npm 包。
        // rolling: 每个请求都重新设置一个 cookie，默认为 false。
        // resave: 即使 session 没有被修改，也保存 session 值，默认为 true。
    })
);
// 静态文件总代理
app.use(express.static("www"));
// 图片
app.use('/images', express.static('files/images'));
// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 跨域处理
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, AppKey, Nonce, CurTime, CheckSum');
    // res.header('Access-Control-Max-Age', 604800);
    // res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use("/session", require("./routers/session"));
app.use("/mongo", require("./routers/mongo"));
app.use("/files", require("./routers/files"));

app.post("/api/login", function (req, res) {
    if (chatSocketMap.get(req.body.userId)) {
        res.json({ code: "error", message: "该id已存在，请更改id！" });
    } else {
        // https://www.npmjs.com/package/jsonwebtoken
        // 登陆成功之后将token发送至客户端，留至建立socket连接时校验时用
        var token = jwt.sign(req.body, jwtSecret, {
            expiresIn: 1800  //时间跨度
        });
        res.json({ code: "success", message: "登陆成功！输入对方id，开始聊天吧！", token: token });
    }
});
// app.set("port", 3000);

var server = http.createServer(app);

var socketIoChat = require("socket.io")(server, {
    path: "/chat"
    // 自定义path，生成对应的socket.io
    // 比如说'/path'为聊天专用的socket.io，'/state'为状态控制专用。逻辑清晰。
});
socketIoChat.sockets
    // https://www.npmjs.com/package/socketio-jwt
    // socket.io连接时验证传入的JWT
    .on("connection", socketioJwt.authorize({
        secret: jwtSecret,
        timeout: 15000  // 15 seconds to send the authentication message
    }))
    // this socket is authenticated, we are good to handle more events from it.
    // 上述是socketio-jwt官方的解释，个人看法：“authenticated”事件是socketio-jwt定义好的一个事件
    // 此事件的目的是在token认证通过连接成功之后,客户端和服务端都能收到此事件。
    .on("authenticated", socket => {
        console.log('id为' + socket.decoded_token.userId + '的用户认证成功');
        // 将所用用户的socket都保存至全局的Map对象chatSocketMap中
        chatSocketMap.set(socket.decoded_token.userId, socket);
        // 发送消息
        socket.on("message/send", (msg, callback) => {
            // 从chatSocketMap中取出对应用户的socket，推送消息
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

mongoose.connection.on("connected", () => {
    console.log("数据库连接成功...");
});

server.listen(3000, () => {
    console.log("正在运行...");
});
