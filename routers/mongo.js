var express = require("express");
var router = express.Router();
var DBtest = require("../db/test");
var co = require('co');

router.get("/getdata", function (req, res) { });

router.post("/add", function (req, res) {
    console.log(req.body);
    // new DBtest.test(req.body).save().then(model => {
    //     res.json({ code: "000000", message: "写入成功！", data: model });
    // });
    
    
    // co(function* () {
    //     var user1 = yield DBtest.test.findTestId(req.body.id);
    //     var user2 = yield DBtest.test.findTestId(111111);
    //     res.json({ code: '000000', message: '查询成功', data: [user1[0],user2[0]] })
    // })
    DBtest.test.findTestId(req.body.id).then(model => {
        res.json({ code: '000000', message: '查询成功', data: [user1[0],user2[0]] })
    })
    
});

module.exports = router;
