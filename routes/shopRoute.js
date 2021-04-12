const express = require('express');
const router = express.Router()
const { all_items, create_item,remove_item, buy_item, edit_item,add_qty } = require('../controllers/shopController')
const {isLoggedIn} = require('../passport')

router.get('/',all_items)
router.post('/create',create_item)
router.delete('/:id',remove_item)
router.put('/:id',edit_item)
router.patch('/add/:id',add_qty)
router.patch('/buy',isLoggedIn,buy_item)
module.exports = router