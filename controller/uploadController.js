const multer = require("multer");
const AppError = require("../utils/appError");
const catchBlock = require("../utils/catchBlock");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);

const multerStorage = multer.memoryStorage();

const multerFilter = async (res, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("file type not support", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImgCommon = upload.fields([{ name: "blogImg", maxCount: 1 }]);

exports.resizeImg = catchBlock(async (req, res, next) => {
  if (!req.files) return next();
  console.log("req.file 222", req.files);
  const baseDir = path.resolve(__dirname, "..");

  const filename = req.files.blogImg[0].originalname.split(".");
  console.log("req.file 333", filename);
  req.body.blogImg = `${filename[0]}_blog${Date.now()}.${filename[1]}`;

  sharp(req.files.blogImg[0].buffer)
    .resize(600, 400)
    .toFile(`${baseDir}/public/images/blog/${req.body.blogImg}`);

  next();
});

exports.uploadImage = (
  imgField = "image",
  upnum = 1,
  folder = "default",
  multi = false,
  resize = false,
  wdt,
  hgt,
) => [
  multi ? upload.array(imgField, upnum) : upload.single(imgField),

  catchBlock(async (req, res, next) => {
    console.log("Incoming files:", req.files, "Incoming file:", req.file);
    const baseDir = path.resolve(__dirname, "..");
    const uploadDir = path.join(baseDir, "public", "images", folder);

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Single file processing
    if (!multi && req.file) {
      const filenameParts = req.file.originalname.split(".");
      const extension = filenameParts.pop();
      const baseName = filenameParts.join(".");
      req.body[imgField] = `${baseName}_${folder}_${Date.now()}.${extension}`;
      const uploadPath = path.join(uploadDir, req.body[imgField]);

      if (resize) {
        if (!wdt || !hgt)
          throw new AppError("Width and height are required for resizing", 400);
        await sharp(req.file.buffer).resize(wdt, hgt).toFile(uploadPath);
      } else {
        await writeFile(uploadPath, req.file.buffer);
      }
    }

    // Multiple files processing
    if (multi && Array.isArray(req.files)) {
      req.body[imgField] = [];
      await Promise.all(
        req.files.map(async (item) => {
          const filenameParts = item.originalname.split(".");
          const extension = filenameParts.pop();
          const baseName = filenameParts.join(".");
          const uniqueFilename = `${baseName}_${folder}_${Date.now()}.${extension}`;
          const uploadPath = path.join(uploadDir, uniqueFilename);

          if (resize) {
            if (!wdt || !hgt)
              throw new AppError(
                "Width and height are required for resizing",
                400,
              );
            await sharp(item.buffer).resize(wdt, hgt).toFile(uploadPath);
          } else {
            await writeFile(uploadPath, item.buffer);
          }

          req.body[imgField].push(uniqueFilename);
        }),
      );
    }

    next();
  }),
];
