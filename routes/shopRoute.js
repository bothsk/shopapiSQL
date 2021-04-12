const express = require('express');
const router = express.Router()
const { all_items, create_item,remove_item, buy_item } = require('../controllers/shopController')

router.get('/',all_items)
router.post('/create',create_item)
router.delete('/:id',remove_item)

router.patch('/buy',buy_item)
module.exports = router