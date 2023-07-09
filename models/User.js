const mongoose = require("mongoose")
const {Schema,model} = mongoose

// registeration process
//login process

// schema stored from here directly to atlus
const userSchema = new Schema({
    username: {type:String ,required:true,unique:true,min:6},
    password:{required:true,type:String}
})

const UserModel = model('User',userSchema)

module.exports = UserModel;
