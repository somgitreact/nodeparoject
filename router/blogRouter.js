const blogcontroller = require("../controller/blogController");
const uploadController = require("../controller/uploadController");
const authController = require("../controller/authController");
const express = require("express");

const router = express.Router();

router.route("/newblog").get(authController.protect, blogcontroller.blog);
router
  .route("/createblog")
  .post(
    authController.protect,
    uploadController.uploadImage("blogImg", 10, "blog", true),
    blogcontroller.createBlog,
  );
router.route("/blogall").get(blogcontroller.blogAll);
router.route("/blogallApi").get(blogcontroller.blogAllApi);
router.route("/blog/:id").get(blogcontroller.blogone);
router
  .route("/blogedit/:id")
  .get(authController.protect, blogcontroller.blogEdit)
  .patch(authController.protect, blogcontroller.blogEditSave);
router
  .route("/blogdelete/:id")
  .delete(authController.protect, blogcontroller.blogDelete);

//router.route('/createblog').post(uploadController.uploadImgCommon, uploadController.resizeImg, blogcontroller.createBlog)

module.exports = router;
