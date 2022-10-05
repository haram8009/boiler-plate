const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리를 하는 곳
    // 1. 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;
    // 2. 토큰 복호화한 후 유저 찾기
        // User 모델에서 함수 만들기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })
        // req에 token과 user를 넣어주면 다른곳에서 사용 가능해짐 
        req.token = token;
        req.user = user;
        next(); // 이거 없으면 middleware에 갇히게됨
    })
    // 3. 유저 있으면 인증 okay 유저 없으면 인증 no
}

module.exports = { auth }; // 다른 파일에서도 쓸 수 있게