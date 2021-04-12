const express = require('express');
const router = express.Router()
const {all_user,user_register,user_login,user_failed,user_logout,user_pwd,user_detail,user_delete} = require('../controllers/userController')
const {isLoggedOut,isLoggedIn,isAdmin} = require('../passport')
const passport = require('passport')
require('../passport')

router.get('/users',isLoggedIn,isAdmin,all_user)

router.get('/user/:id',user_detail)

router.post('/register',isLoggedOut,user_register)

router.patch('/pwd',isLoggedIn,user_pwd)

router.delete('/user/:id',user_delete)

router.post('/login',isLoggedOut,passport.authenticate('local', { failWithError: true }),user_login,user_failed)

router.get('/logout',isLoggedIn,user_logout)

module.exports = router
