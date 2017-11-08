var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var testSchema = new Schema({
    id: Number,
    name: String,
    phone: Number
});
testSchema.statics.findTestId = function(id, cb) {
    return this.find({ id: id }).exec();
};

exports.test = mongoose.model("test", testSchema);
