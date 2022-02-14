const express = require('express') // get Express.js
const route = require('./route/urls.js')

const app = express() // ตัวดำเนินการของ express ทั้งหมด

// cookie parser
const cookieParser = require('cookie-parser')

// express session
const session = require('express-session')

// use cookieParser
app.use(cookieParser())

// use express session
app.use(session({secret: 'session_id', resave: false, saveUninitialized: false}))

// ใช้งาน method post -> ต้องถูกเรียนใช้ก่อน router
app.use(express.urlencoded({extended: false}))

// การใช้งาน router (urls.js)
app.use(route)

// การจัดการกับ static file
const path = require('path')
app.use(express.static(path.join(__dirname,'public')))

// การจัดการกับ ejs templates engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// config port
app.listen(3333, ()=>{
    console.log('server at port 3333 is running ...');
})