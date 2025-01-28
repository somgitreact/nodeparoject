const Rating = require('../model/ratingModel');

const { addData, showAll, updateData, deleteOne } = require('../utils/actionCreator');
const catchBlock = require('../utils/catchBlock');



exports.getproDetils = async(req, res)=>{
if(!req.body.product) req.body.product = req.params.id;
if(!req.body.user) req.body.user = req.user._id;
}


exports.createReview = addData(Rating, 404)
exports.reviewAll= showAll(Rating, 400)
exports.getreviewbyId = catchBlock(
    async (req, res)=>{
        if(!req.body.product) req.body.product = req.params.id;
        const reviewbyId = await Rating.find({"product": "676a81c6e670a0621a0d2700"}).select('rateNum comments' )

        res.status(200).json({
            status: "succes",
            data: reviewbyId

        })
    }
)

exports.editReview = updateData(Rating, 404);
exports.deleteReview = deleteOne(Rating, 404);