const query = require('../db')

/////// Email Validator/////
const validator = require('email-validator')
///// Hash PWD ////////
const bcrypt = require('bcrypt')

const all_user = async (req,res) => {
    let data
    try {
        data = await query(`SELECT * FROM users`)
    } catch {
        return res.status(500).json({status:{error:true,message:'error while processing with Database'}})
    }
    res.json(data)
}

const user_detail = async (req,res)=>{
    const {username} = req.params
    let data 
    try{
        data = await query('SELECT * FROM users WHERE username = ?',username)
    } catch {
        return res.status(500).json({status:{error:true,message:'error while processing with Database'}})
    }

    if (data.length==0) return res.status(404).json({status:{error:true,message:'not found input user'}})
    res.json(data)
}

const user_register = async (req,res)=>{
    const {username,password,password2,email,isAdmin} = req.body
    if (!username||!password||!password2||!email) return res.json({status:{error:true,message:`username, password, password2 and email are required`}})
    if (password!==password2) return res.json({status:{error:true,message:`password not matching`}})

    if (!validator.validate(email)) return res.json({status:{error:true,message:`incorrect email input`}})

    let existedUser
    
    try {
        existedUser = await query(`SELECT username FROM users WHERE username='${username}' or email='${email}'`)
        if (existedUser.length>0) return res.json({status:{error:true,message:`username or email is already existed`}})
    } catch {
        return res.status(500).json({status:{error:true,message:`error while checking existed username`}})
    }

    let hashedPwd
    try { hashedPwd  = bcrypt.hashSync(password,10) } catch {return res.json({status:{error:true,message:`error while hashing password`}})}
   

    let addUser
    try {
     addUser = await query('INSERT INTO users(username,password,email,isAdmin) VALUES (?,?,?,?)',[username,hashedPwd,email,isAdmin])
    } catch {
        return res.status(500).json({status:{error:true,message:`error while adding username`}})
    }
    res.json({username:`${username}`,status:{error:null,message:`Successfully created user`}})
}

const user_login = async (req,res,next)=>{
    res.json({status:{error:null,message:`User ${req.user.username} is successfully logged in`}})
}

const user_failed = async (err,req,res,next)=>{
    res.json({status:{error:true,message:'Incorrect Username or Password'}})
}

const user_logout = async (req,res)=>{
    const user = req.user.username
    req.logout()
    res.json({status:{error:null,message:`User ${user} is successfully logged out`}})
   
}

const user_pwd = async (req,res)=>{
    const {password,newpassword,newpassword2} = req.body
    if (!password||!newpassword||!newpassword2) return res.json({status:{error:true,message:'password , new password and confirm password are required'}})
    if (newpassword!==newpassword2)  return res.json({status:{error:true,message:'new password and confirm password are not matched'}})
   
    let user 
    try {
    user = await query('SELECT password FROM users WHERE username= ?',req.user.username) 
    } catch {
        return res.status(500).json({status:{error:true,message:'Error while getting old password'}})
    }

 
    let checkedPwd
    try {
        checkedPwd = bcrypt.compareSync(password,user[0].password)
    } catch {
        return res.json({status:{error:true,message:'Error while comparing password'}})
    }

    if (!checkedPwd) return res.json({status:{error:true,message:'Incorrect password'}})

    if (password==newpassword) return res.json({status:{error:true,message:`can't change password same as current password`}})

    let hashedPwd
    try {
        hashedPwd = bcrypt.hashSync(newpassword,10)
    } catch {
        return res.json({status:{error:true,message:'Error while hashing new password'}})
    }
    
    let updatePwd
    try{
        updatePwd = await query('UPDATE users SET password = ? WHERE username = ?',[hashedPwd,req.user.username])
    } catch  {
        return res.status(500).json({status:{error:true,message:'Error while updating password'}})
    }

    res.json({status:{error:null,message:`User ${req.user.username} has successfully changed password`}})

}

module.exports = {
    all_user,
    user_register,
    user_login,
    user_failed,
    user_logout,
    user_pwd,
    user_detail
}