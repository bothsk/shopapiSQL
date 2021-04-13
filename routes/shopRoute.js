const express = require('express');
const router = express.Router()
const { all_items, create_item,remove_item, buy_item, edit_item,add_qty,all_orders,my_orders } = require('../controllers/shopController')
const {isLoggedIn,isAdmin} = require('../passport')

router.get('/',all_items)
router.post('/create',isLoggedIn,isAdmin,create_item)
router.delete('/:id',isLoggedIn,isAdmin,remove_item)
router.put('/:id',isLoggedIn,isAdmin,edit_item)
router.patch('/add/:id',isLoggedIn,isAdmin,add_qty)
router.patch('/buy',isLoggedIn,buy_item)
router.get('/myorders',isLoggedIn,my_orders)
router.get('/orders',isLoggedIn,isAdmin,all_orders)
module.exports = router