const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const query = require('./db')

passport.use(new LocalStrategy(async (username,password,done)=>{
    const user = await query('SELECT * FROM users WHERE username = ?',[username])
    if (user.length==0) return done(null,false)
   
    const checkPwd = await bcrypt.compare(password,user[0].password)
    if (!checkPwd) return done(null,false)

    done(null,user[0])
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    const user = await query('SELECT username,isAdmin FROM users WHERE id = ?',[id])
    if (user.length==0) return done(null,false)
    done(null,user[0])
})

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    return res.status(500).send({status:{error:true,message:`Can't access the page, login needed`}})
}

function isLoggedOut(req,res,next){
    if (!req.isAuthenticated()){
        return next()
    }
    return res.status(500).send({status:{error:true,message:`Can't access the page, user is already logged in`}})
}

function isAdmin(req,res,next){
    if (req.user.isAdmin=='true'){
        return next()
    } 
    return res.status(404).send({status:{error:true,message:'Only admin can access this page'}})
}


module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin
}