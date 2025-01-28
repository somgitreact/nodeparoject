const Product = require('../model/productModel');
const MaxPriceByType = require('../model/maxPricebyTypeModel')
const actionCreator = require('../utils/actionCreator');
const catchBlock = require('../utils/catchBlock')
const multer = require('multer')
const sharp = require('sharp');
const AppError = require('../utils/appError');
const fs = require('fs');
const path = require('path');

const multerStorage = multer.memoryStorage(); 
const multerFilter = (req,file,cb)=>{
  console.log("zzzz1");
  
if(file.mimetype.startsWith('image')){
  cb(null, true)
} else {
 cb( new AppError("plz upload image", 400), false) 
}
console.log("zzzz2");
}

const upload = multer({
  storage:multerStorage,
  fileFilter: multerFilter
})

exports.uploadMainPhoto = upload.single('mainImg');

exports.resizephoto = catchBlock(
  async(req, res, next)=>{

    if(!req.file) return next();

    req.file.filename  = `image--${Date.now()}.jpeg`;

     await sharp(req.file.buffer)
    .resize(320, 240)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/${req.file.filename}`);



     next()
  }

 
)






// exports.addProduct =  async(req, res) => {
//     try {
//         const dataAdd = await Product.create(req.body) 
//await Product.findByIdAndUpdate
//         res.status(201).json({
//          status:"success",
//          dataAdd
 
//         })
//      } catch (error) {
//          console.log(error);
//          res.status(400).json({
//              status:"fail",
//              message: error.message
     
//             })
//      }
// }

// exports.addProduct = catchBlock( async(req, res) => {
    
//     const dataAdd = await Product.create(req.body) 
//     res.status(201).json({
//      status:"success",
//      dataAdd
//     })
// })

exports.addProduct = actionCreator.addData(Product,400)
exports.showAllProduct = actionCreator.showAll(Product,400);
exports.singleProduct = actionCreator.oneData(Product,400);
exports.updateProduct = actionCreator.updateData(Product,400);
exports.deleteProduct = actionCreator.deleteOne(Product,400);


exports.singleProductBackend = actionCreator.oneData(Product,400,'productEditbyId');




  
exports.revisedPriceAlldata = catchBlock( async(req,res)=>{

    const allProduct = await Product.aggregate([
        
        {
          $group: {
            _id: '$type',
            maxPrice: { $max: '$price' },
            name: { $first: '$name' },
            type: { $first: '$type' },
            category: { $first: '$category' },
            mainImg: { $first: '$mainImg' },
            details: { $first: '$details' },
            
          }
        },
        {
            $unwind:  '$type' 
          },
        {
          $project: {
            _id: 1, // Exclude the `_id` field
            type: 1,
            maxPrice: 1,
            name: 1,
            category: 1,
            mainImg: 1,
            details: 1
          }
        }
      ]);






res.status(200).json({
    status:"success",
    allProduct
})

})







const updateMaxPrice = async (product) => {
  const { type, price } = product;

  // Find the existing maxPrice for this type
  const existingMaxPrice = await MaxPriceByType.findOne({ type });

  // If no maxPrice exists for this type, create a new record
  if (!existingMaxPrice) {
    await MaxPriceByType.create({ type, maxPrice: price });
  } else {
    // Otherwise, update the maxPrice if necessary
    const newMaxPrice = Math.max(existingMaxPrice.maxPrice, price);
    await MaxPriceByType.updateOne({ type }, { maxPrice: newMaxPrice });
  }
};





//const upload22 = multer({ dest: 'public/'})


exports.addProduct2 = catchBlock(
  async (req,res) => {
  //  console.log({...(req.body).toObject(), mainImg: req.file.filename});
    console.log("dsdsd", req.file);
    
    //const obj = 
    const productData = {
      ...req.body, // Spread the body fields
      mainImg: req.file?.filename, // Add the file's name (optional chaining to handle undefined)
    };
     const product = await Product.create(productData);
    // //await product.save();
  
    // // After saving the product, update the maxPrice for the type
    await updateMaxPrice(product);

    if (req.file) {
      // Construct the new filename using product ID
      const newFilename = `image-${product._id}-${Date.now()}.jpeg`;

      // Rename the file to include the product ID
  
      fs.renameSync(
        path.join(__dirname, '../public/images', req.file.filename),
        path.join(__dirname, '../public/images', newFilename)
      );

      // Update the product with the new filename
      product.mainImg = newFilename;
      await product.save();
    }




    res.status(201).json({
      starus: "success",
      product
    })
  }
  
) 







exports.getProductsWithMaxPrice = catchBlock(


  async (req, res,type) => { 
    
    const allMaxprice = await MaxPriceByType.find()

    
    // Fetch the maxPrice for the product type
    // const maxPriceObj = await MaxPriceByType.findOne({ type});
  
    // if (!maxPriceObj) {
    //   return { status: 'error', message: 'No max price found for this type' };
    // }
  
    // Fetch products of this type
    const products = await Product.find();
   // console.log(allMaxprice, "-- ", products ) 
    // Add maxPrice to each product
    // const productsWithMaxPrice = products.map(product => ({
    //   ...product.toObject(),
    //   maxPrice: maxPriceObj.maxPrice
    // }));

//     const productsWithMaxPrice = products.map(product => {
//      // console.log("product", product);
      
//       allMaxprice.map((pro)=>{
     
//       if(pro.type !== product.type) { 
//               console.log(pro.type, product.type, pro.maxPrice);

//        let  proo = {...product.toObject(), 'maxPrice': pro.maxPrice}
       
// console.log("proo", proo);
// return proo
  
//       }
        
         
//       })

//     } );

    const productsWithMaxPrice = products.map(product => {
      const matchingPrice = allMaxprice.find(pro => pro.type === product.type);
      return {
          ...product.toObject(), // Spread the product object
          maxPrice: matchingPrice ? matchingPrice.maxPrice : null, // Add maxPrice or set null if no match
      };
  });
  
//console.log(productsWithMaxPrice);



    // return {
    //   status: 'success',
    //   data: productsWithMaxPrice
    // };

    res.status(200).json({
      status:"success",
     data: productsWithMaxPrice
    })
  }

  

) 


exports.updateproductWithMaxPrice = catchBlock(
  async(req,res, next)=>{
console.log('ssdssd');

    const updatepro = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})

 
    //const updateMaxP = await MaxPriceByType.findOneAndUpdate({ type: updatepro.type }, {maxPrice : Math.max(updateMaxP.maxPrice, updatepro.price)}, {new: true, runValidators:true})
    const updateMaxP = await MaxPriceByType.findOneAndUpdate(
      { type: updatepro.type },
      { $max: { maxPrice: updatepro.price } }, // Use $max to update only if the new price is higher
      { new: true, upsert: true } // Create the record if it doesn't exist
    );


   res.status(200).json({
    status: "update",
    updatepro,
   updateMaxP
   })


  }
)