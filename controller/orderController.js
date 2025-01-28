const Product = require('../model/productModel');
const catchBlock = require('../utils/catchBlock');


exports.sendOrderTo = catchBlock(
    async(req,res)=>{
      
        const distances = await  Product.aggregate([
            {
                $geoNear: {
                  near: {
                    type: 'Point',
                    coordinates: [22.536675, 88.348723 ]
                  },
                  distanceField: 'distance',
                  query: { type: "mango" },
                 "distanceMultiplier" : 0.001,
                }
              },
              {
                $sort: { distance: 1 }
             },
              {
                $project: {
                  distance: 1,
                  name: 1,
                }
              }
            
            
            
            
         ])

         res.status(200).json({
            status: 'success',
            data: {
              data: distances
            }
          });
    }
)