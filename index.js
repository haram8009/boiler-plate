const express = require('express')
const app = express()
const port = 5000 // 이건 아무거나 써도 되는데 우린 5000쓰자
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User.js"); // 이렇게 가져와야 쓸 수 있음

// 클라이언트에서 보내는 정보를 분석해서 서버에서 가져올 수 있게해줌
// application/x-www-form-urlencoded 타입
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})