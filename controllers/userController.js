const db = require('../db')

/////////// Async/await with SQL//////////
const util = require('util') 
const query = util.promisify(db.query).bind(db)
/////// Email Validator/////
const validator = require('email-validator')
///// Hash PWD ////////
const bcrypt = require('bcryptjs')

const all_user = async (req,res) => {
    
    let data
    try {
        data = await query(`SELECT * FROM users`)
    } catch (err){
        return res.json({status:{error:true,message:'error while processing with Database'}})
    }
    res.json(data)
}

const user_register = async (req,res)=>{
    const {username,password,password2,email} = req.body
    if (!username||!password||!password2||!email) return res.json({status:{error:true,message:`username, password, password2 and email are required`}})
    if (password!==password2) return res.json({status:{error:true,message:`password not matching`}})

    if (!validator.validate(email)) return res.json({status:{error:true,message:`incorrect email input`}})

    let existedUser
    
    try {
        existedUser = await query(`SELECT username FROM users WHERE username='${username}' or email='${email}'`)
        if (existedUser.length>0) return res.json({status:{error:true,message:`username or email is already existed`}})
    } catch {
        return res.json({status:{error:true,message:`error while checking existed username`}})
    }

    let hashedPwd
    try { hashedPwd  = bcrypt.hashSync(password,10) } catch {return res.json({status:{error:true,message:`error while hashing password`}})}
   

    let addUser
    try {
    addUser = await query(`INSERT INTO users(username,password,email) VALUES ('${username}','${hashedPwd}','${email}')`)
    } catch {
        return res.json({status:{error:true,message:`error while adding username`}})
    }
    res.json({username:`${username}`,status:{error:null,message:`Successfully created user`}})
}


module.exports = {
    all_user,
    user_register
}