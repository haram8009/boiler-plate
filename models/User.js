const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image : String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number 
    }
})

userSchema.pre('save', function( next ) {
    var user = this;
    // 조건 : 이메일이나 다른것이 아닌 비밀번호를 다시 저장할때 만 암호화 새로 하도록!
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            
            bcrypt.hash(user.password, salt, function(err, hash) { // hash가 암호화된 비밀번호
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next() // 이게 없으면 여기 계속 머물게됨
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }