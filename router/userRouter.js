 const userController = require('../controller/userController')
 const authController = require('../controller/authController')
const express = require('express');
const { uploadImage } = require('../controller/uploadController');

const router = express.Router();


router.route('/createUser').post(authController.createUser)
router.route('/login').post(authController.login)
router.route('/forgotPassword').post( authController.forgetPassword)
router.route('/resetToken/:token').patch(authController.resetToken)

router.route('/passUpdate').patch(authController.protect,  authController.passwordUpdate) //authController.ifLoggedIn(true),

router.route('/editUser/:id').patch(authController.protect, uploadImage('photo', 1, 'user', false, true, 100, 100), uploadImage('sss', 10, 'user', true, true, 300, 200), userController.editUser)
router.route('/showAllUser').get(authController.protect, authController.allowRole('admin'), userController.allUser)
router.route('/showuser').get(authController.protect, userController.oneUser)
router.route('/deleteUser').delete(authController.protect, userController.deleteUser)
router.route('/logout/:id').post(authController.logout)




module.exports  = router;