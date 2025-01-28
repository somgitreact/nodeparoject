const mongoose =  require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { validate } = require('./productModel');

const userSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        required:[true,"mus have email"],
        unique: true,
        trim: true,
        validate:{
            validator: function(value){
               return validator.isEmail(value)
            },
            message: "this is  not valid email" 
        },
        set: function(value){
            return validator.normalizeEmail(value)
         }
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select:false
    },
    confirmPassword:{
        type: String,
        validate:{
            validator: function(conpass){
                return this.password === conpass
            },
            message:" password not match"
        }
    },
    role:{
        type:String,
        enum:["admin", "vendor", "maneger", "porter", "user"],
        default: "user"
    },
    photo: String,
    sss: [],
    resetToken: String,
    resetTokenExpire:Date
})

userSchema.pre('save', async function(next){
    // Only hash the password if it has been modified or is new
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    next()
})


userSchema.methods.matchPass = async function(password, hashpassword){
    return await bcrypt.compare(password, hashpassword);
}

userSchema.methods.forgetToken = function(){
    const sendResetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = crypto.createHash('sha256').update(sendResetToken).digest('hex');
    this.resetTokenExpire = Date.now() + 10 * 60 * 1000

   // console.log(sendResetToken, "----",  crypto.createHash('sha256').update(sendResetToken).digest('hex'));
    return sendResetToken
    

}



const User = mongoose.model('User', userSchema)
module.exports = User