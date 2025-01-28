const Blog = require("../model/blogModel");
const {
  showAll,
  oneData,
  updateData,
  deleteOne,
} = require("../utils/actionCreator");
const catchBlock = require("../utils/catchBlock");

exports.blog = catchBlock(async (req, res) => {
  // console.log('sasasas', req.body);

  res.status(200).render("blogCreation");
});

exports.createBlog = catchBlock(async (req, res) => {
  console.log("sasasas", req.files);

  const addedBlog = await Blog.create(req.body);

  res.status(201).render("allproduct", {
    data: addedBlog,
  });
});

exports.blogAll = showAll(Blog, 200, "allblog");
exports.blogAllApi = showAll(Blog, 200);
exports.blogone = oneData(Blog, 200);
exports.blogEdit = oneData(Blog, 200);
exports.blogEditSave = updateData(Blog, 200);
exports.blogDelete = deleteOne(Blog, 200);
