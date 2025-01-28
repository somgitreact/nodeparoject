const express = require('express');
const productController = require('../controller/productController')
const authController = require('../controller/authController')
const viewsController = require('../controller/viewsController')

const router = express.Router({ mergeParams: true })

router.route('/showAllData').get(productController.showAllProduct);
router.route('/getpro').get(productController.getProductsWithMaxPrice)
router.route('/product/:id').get(productController.singleProduct);
// router.route('/revisedprice').get(productController.revisedPriceAlldata)

router.route('/addproduct').post(authController.protect, authController.allowRole("admin", "vendor"), productController.addProduct)
router.route('/updateProduct/:id').patch(authController.protect, authController.allowRole("admin", "vendor"), viewsController.uploadImage, viewsController.resizeImage, productController.updateProduct) 
router.route('/updatepro/:id').patch(authController.protect, authController.allowRole("admin", "vendor"), productController.updateproductWithMaxPrice)
router.route('/deleteProduct/:id').delete(authController.protect, authController.allowRole("admin", "vendor"), productController.deleteProduct)

router.route('/addproduct2').post(authController.protect, authController.allowRole("admin", "vendor"), productController.uploadMainPhoto, productController.resizephoto, productController.addProduct2)
// ******



module.exports = router    