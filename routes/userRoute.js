const express = require('express');
const router = express.Router()
const {all_user,user_register} = require('../controllers/userController')

router.get('/',all_user)

router.post('/register',user_register)

module.exports = router
