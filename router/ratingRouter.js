const ratingController = require('../controller/ratingController')
const auth = require('../controller/authController')
const express =  require('express')


const router = express.Router();


router.route('/reviewall').get( ratingController.reviewAll)
router.route('/create').post( ratingController.createReview)
router.route('/reviewbyId').get( ratingController.getreviewbyId)
router.route('/reviewedit').patch( ratingController.editReview)
router.route('/reviewdelete').delete( ratingController.deleteReview)
//auth.protect, ratingController.getproDetils,




module.exports = router