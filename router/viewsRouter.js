const express = require('express')
const productController = require('../controller/productController')
const viewsController = require('../controller/viewsController')


const router = express.Router()


router.get('/allproduct', viewsController.showAllView)



router.get('/uploadproduct', viewsController.uploadProductPage)
router.route('/uploadedprodata').post(viewsController.uploadImage, viewsController.resizeImage, viewsController.uploadProduct)



router.get('/editproduct/:id', productController.singleProductBackend);


router.route('/editsave/:id').post(viewsController.uploadImage, viewsController.resizeImage, viewsController.editSave)


module.exports = router;   