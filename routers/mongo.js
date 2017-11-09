var express = require("express");
var router = express.Router();
var DBtest = require("../db/test");
var co = require('co');

router.get("/getdata", function (req, res) {
    co(function* () {
        var userArr = yield DBtest.test.findTestId();
        res.json({ code: '000000', message: '读取成功', data: { list: userArr } })
    })
});

router.post("/add", function (req, res) {

    co(function* () {
        var sixposint = function () {
            var sixnum;
            for (var i = 0; i < 6; i++) {
                if (i == 0) {
                    var mathFloor = function () {
                        var num = Math.floor(Math.random() * 10);
                        if (!num) {
                            num = mathFloor();
                        }
                        return num;
                    };
                    sixnum = String(mathFloor());
                } else {
                    sixnum += Math.floor(Math.random() * 10);
                }
            }
            // var res = yield DBtest.test.findTestId(sixnum);
            // if (res.length > 0) {
            //     sixposint()
            // }
            return sixnum;
        }
        req.body.id = sixposint();
        req.body.Date = new Date();
        // new DBtest.test(req.body).save().then(model => {
        //     res.json({ code: "000000", message: "写入成功！", data: model });
        // });
        var user = new DBtest.test(req.body).save();
        if (user) {
            res.json({ code: '000000', message: '写入成功', data: user })
        }

    })
});

router.post("/remove", function (req, res) {
    co(function* () {
        yield DBtest.test.removeTestId(req.body.id);
        res.json({ code: '000000', message: '删除成功' });
    })
});
router.post("/update", function (req, res) {
    co(function* () {
        var user = yield DBtest.test.updateTestId(req.body);
        res.json({ code: '000000', message: '更新成功', data: user });
    })
});
module.exports = router;
