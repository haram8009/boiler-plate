const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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


userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })

}

userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken을 이용해 token 생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // decode token
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저아이디 이용해 유저 찾아 클라이언트에서 가져온 토큰과 DB의 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token }, function (err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }