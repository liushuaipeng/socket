var mongoose = require("mongoose");
mongoose.Promise = global.Promise
var Schema = mongoose.Schema;

var testSchema = new Schema({
    id: Number,
    name: String,
    nickname: String,
    Date: Date,
    phone: Number
});
testSchema.statics.findTestId = function (id, cb) {
    if (id) {
        return this.find({ id: id }).exec();
    } else {
        return this.find().exec();
    }
};
testSchema.statics.removeTestId = function (id, cb) {
    if (id) {
        return this.remove({ id: id }).exec();
    } else {
        return Promise.reject();
    }
};
testSchema.statics.updateTestId = function (data, cb) {
    if (data.id) {
        return this.update({ id: data.id }, { $set: data }).exec();
    } else {
        return Promise.reject();
    }
};

exports.test = mongoose.model("test", testSchema);
