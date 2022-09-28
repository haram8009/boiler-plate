const express = require('express')
const app = express()
const port = 5000 // 이건 아무거나 써도 되는데 우린 5000쓰자

// mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://haram:bemyharam@boilerplate.vjvoi1r.mongodb.net/?retryWrites=true&w=majority',{    
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))
//mongodb+srv://haram:<password>@boilerplate.vjvoi1r.mongodb.net/?retryWrites=true&w=majority

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})