var express = require("express");
var router = express.Router();

router.get("/user", function(req, res) {
    if (req.session.user) {
        res.json({
            code: "000000",
            message: "获取成功！",
            data: req.session.user
        });
    } else {
        res.json({
            code: "000001",
            message: "user不存在"
        });
    }
});
router.post("/login", function(req, res) {
    req.session.user = req.body;
    res.json({ code: "000000", message: "登陆成功！" });
});

module.exports = router;
