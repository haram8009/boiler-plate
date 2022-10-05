const express = require('express')
const app = express()
const port = 5000 // 이건 아무거나 써도 되는데 우린 5000쓰자
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require("./models/User.js"); // 이렇게 가져와야 쓸 수 있음

// 클라이언트에서 보내는 정보를 분석해서 서버에서 가져올 수 있게해줌
// application/x-www-form-urlencoded 타입
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입
app.use(bodyParser.json());
app.use(cookieParser());

// mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{    
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 오늘 하루도 행복하세요~')
})

app.post('/register', (req, res) => {
  // 회원가입에 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body) // body-parser가 있어서 이렇게 정보 받을 수있음

  user.save((err, userInfo) => { 
    if(err) return res.json({success: false, err}) // 에러가 있다면 json형식으로 전달
    return res.status(200).json({
      success: true
    }) // 200은 성공했다는 뜻
  })
})

app.post('/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에 있는지 찾기
  User.findOne({email: req.body.email}, (err, user) => { // user안에 유저정보 들어있음
    console.log(user)
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청한 이메일이 있다면 비밀번호가 같은지 확인
    user.comparePassword(req.body.password , ( err, isMatch ) => {
      if(!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다."
      })
      // 비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        console.log(user.token)
        if(err) return res.status(400).send(err);
        // token을 cookie에 저장
        res.cookie("x_auth", user.token)
           .status(200)
           .json({ loginSuccess: true, userId: user._id });
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})