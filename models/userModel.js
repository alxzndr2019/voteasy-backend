const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    role:{type:String, required:true},
    email: {type:String, required:true},
    nin: {type:Number, required:true},
    passwordHash: {type:String, required:true, minlength:5},
    votes:{type:Array},
    otp:{type:Number}
});
const User = mongoose.model("user", userSchema);
module.exports = User;