const mongoose =  require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:[true, 'use title']
    },
    description:String,
    blogImg:String,
    cration: {
        type: Date,
        default: Date.now()
    }  
})








const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog