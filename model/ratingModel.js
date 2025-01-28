const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');


const ratingSchema = new  mongoose.Schema({
    rateNum: {
        type: Number,
        require:[true, "must gave a rate num"]
    },
    comments: String,
    createAt: Date,
    product:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required:[true, "new poduct id"]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, "new user id"]
    }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating 