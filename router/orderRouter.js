const express = require('express')
const orderController = require('../controller/orderController')


const router = express.Router();

router.route('/distance').get(orderController.sendOrderTo)



module.exports =router