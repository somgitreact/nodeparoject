const Product =  require('../model/productModel')
const multer = require('multer');
const sharp= require('sharp');

const AppError = require('../utils/appError');
const catchBlock = require('../utils/catchBlock');
const { Model } = require('mongoose');


const multerStorage = multer.memoryStorage()

const multerfilter = (req, file, cb)=>{
    if (file.mimetype.startsWith('image')){
        cb(null, true)
    } else {
        cb(new AppError('no image type', 400), false)
    };
    
}

const upload = multer({
    Storage: multerStorage,
    fileFilter: multerfilter
})


exports.uploadImage = upload.fields([
    {name: 'mainImg', maxCount:1},
    {name: 'relatedImages', maxCount:5}
]) 



exports.resizeImage = catchBlock( async(req,res, next)=>{
  console.log('resizeImage route reached');
     req.body.mainImg = `product-${Date.now()}.jpeg`

    await sharp(req.files.mainImg[0].buffer)
    .resize(400,400)
    .toFormat('jpeg')
    .jpeg(90)
    .toFile(`public/images/${req.body.mainImg}`)


     req.body.relatedImages = []
    
    await Promise.all(
      
        req.files.relatedImages.map(  async (img, i)=>{
  const relatedImage = `gallery-${Date.now()}-${i+1}.jpeg`
            await sharp(img.buffer)
            .resize(400,400)
            .toFormat('jpeg')
            .jpeg(90)
            .toFile(`public/images/${relatedImage}`)

            req.body.relatedImages.push(relatedImage)
        })

       
    )
console.log("sdsdsdsd", req.body.relatedImages);

next()
}
)











exports.uploadProduct = async (req, res) => {
  console.log("new ----" , req.body);
  
    try {
      const { name, type, category, price, priceDiscount, description, location,  additionalInfo } = req.body;
      // const mainImage = req.files['mainImage'] ? req.files['mainImage'][0].filename : null;
      // const relatedImages = req.files['relatedImages'] ? req.files['relatedImages'].map(file => file.filename) : [];
      const mainImg = req.body.mainImg 
      //req.files['mainImg'] ? req.files['mainImg'][0].filename : null;
      const relatedImages = req.body.relatedImages 
      //req.files['relatedImages'] ? req.files['relatedImages'].map(file => file.filename) : [];
  
      console.log('Main Image:', mainImg);
      console.log('Related Images:', relatedImages);
  
    // Extract FAQ data
    const faq = [];
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('careQ-')) {
        const index = key.split('-')[1];
        const question = req.body[key];
        const answer = req.body[`careA-${index}`];
        if (question && answer) {
          faq.push({ Q: question, A: answer });
        }
      }
    });

    // Example of extracted FAQ
    console.log('Extracted FAQ:', faq);


        // Extract Tips data
        const careTips = [];
        Object.keys(req.body).forEach(key => {
          if (key.startsWith('tips-')) {
            const index = key.split('-')[1];
            
            const tips = req.body[`tips-${index}`];
            if ( tips) {
              careTips.push(tips);
            }
          }
        });

        console.log('Extracted FAQ:', careTips);



      // Create a new product instance
      const product = new Product({
        name,
        type,
        category,
        price,
        priceDiscount,
        description,
        location,
        careTips,
        additionalInfo,
        faq,
        mainImg,
        relatedImages,
      });
  
      // Save the product to the database
      const newprod = await product.save();
  
     // res.send('Product data submitted successfully!');

      res.status(200).render('productEdit', {
        data: newprod
      })




    } catch (err) {
      console.error('Error saving product data:', err);
      res.status(500).send('Error submitting product data');
    }
  }


  exports.uploadProductPage = catchBlock((req, res)=>{
console.log(req);

    res.status(200).render('uploadproduct', {
        title : 'upload new product'
    })

  }) 



  exports.editSave = async (req, res) => {
    console.log('editSave route reached');
    try {
        const { deletedImages, ...otherData } = req.body;

        // Delete images from the server
        if (deletedImages) {
            const imagesToDelete = JSON.parse(deletedImages);
            imagesToDelete.forEach((image) => {
                const filePath = `public/images/${image}`;
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Failed to delete image: ${filePath}`, err);
                });
            });
        }

        // Update product with new data
        const updatedProduct = await Model.findByIdAndUpdate(
            req.params.id,
            otherData,
            { new: true, runValidators: true }
        );

        res.status(200).render('editsave', {
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while saving the changes.');
    }
};
