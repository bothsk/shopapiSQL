require('dotenv').config()
const express = require('express');
const app = express()
const userRoute = require('./routes/userRoute')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use(cookieParser())
app.use(
    session({
      secret: process.env.ssSecret,
      resave: false,
      saveUninitialized: false,
        })
  )

app.use(passport.initialize())
app.use(passport.session())  

app.use('/',userRoute)



app.use((req,res)=>{
    res.status(404).json({status:{error:true,message:`404 Not found URL`}})
})



app.listen(3000,()=>{
    console.log('Server is running')
})