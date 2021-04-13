const express = require('express');
const router = express.Router()
const { all_items, create_item,remove_item, buy_item, edit_item,add_qty,all_orders,my_orders } = require('../controllers/shopController')
const {isLoggedIn,isAdmin} = require('../passport')

router.get('/',all_items)
router.post('/create',create_item)
router.delete('/:id',remove_item)
router.put('/:id',edit_item)
router.patch('/add/:id',add_qty)
router.patch('/buy',isLoggedIn,buy_item)
router.get('/myorder',isLoggedIn,my_orders)
router.get('/orders',all_orders)
module.exports = router