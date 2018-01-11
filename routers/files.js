var express = require("express");
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var co = require('co');

// 文件上传

router.post('/upload', (req, res, next) => {
    var storage = multer.diskStorage({
        destination: 'files/images',
        filename: function (req, file, callback) {
            var name = new Date().getDay()
            var random = Math.random()
            callback(null, `${name + random + '.jpg'}`)
        }
    })
    var uploads = multer({ storage }).array('files', 6);
    uploads(req, res, function (err) {
        if (err) {
            return;
        }
        console.log(req.files[0]);
        setTimeout(() => {
            res.json({
                code: '000000',
                message: '上传成功！',
                data: {
                    path: req.files[0].path
                }
            })
        }, 2000);
    })
})

// 文件下载
router.get("/download/*", function (req, res) {
    res.setHeader("Content-Type", "application/octet-stream");
    fs.createReadStream('files/0410').pipe(res);
});

module.exports = router;