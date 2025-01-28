const catchBlock = require('../utils/catchBlock')
const AppError = require('./appError')
const revirw = require('../model/ratingModel')
// exports.addData = async (model, errorcode, req, res)=>{
    
//         try {
//            const dataAdd = await model.create(req) 
//            res.status(201).json({
//             status:"success",
//             dataAdd
    
//            })
//         } catch (error) {
//             console.log(error);
//             res.status(errorcode || 400).json({
//                 status:"fail",
//                 message: error.message
        
//                })
//         }
        
    
    
// }



exports.addData = (model, errorcode, pugtemplate) =>
    catchBlock(async (req, res, next) => {
      const dataAdd = await model.create(req.body);
     
      if(!pugtemplate){
        res.status(200).json({
       status: "success",
       data:{dataAdd} 
   })
   } else {

       res.status(200).render(pugtemplate, {
       //title: findData.name,
       data:{dataAdd}  
   }) 
   }
    });


    exports.updateData = (model, errorcode, pugtemplate) =>
        catchBlock(async (req, res, next) => {
            // console.log(req.files.mainImg);
            // console.log(req.files.relatedImages);
            
          const dataUpdate = await model.findByIdAndUpdate(req.params.id, req.body, {new:true, validator:true});
        
          if(!pugtemplate){
            res.status(200).json({
           status: "success",
           data:{dataUpdate} 
       })
       } else {    
           res.status(200).render(pugtemplate, {
           //title: findData.name,
           data:{dataUpdate}  
       }) 
       }
        

        });

exports.showAll = (model, errorcode, pugtemplate)=>
    catchBlock( async(req,res, next)=>{
        const dataAll = await model.find();


        if(!pugtemplate){
          res.status(200).json({
         status: "success",
         quentity: dataAll.length,
         data:dataAll
     })
     } else {    
         res.status(200).render(pugtemplate, {
         //title: findData.name,
         data:dataAll  
     }) 
     }



    }
)

exports.oneData = (model, errorcode, pugtemplate)=>

  
    catchBlock( async (req, res)=>{
     
        const findData = await model.findById(req.params.id) //.populate('review');
      //  const review = await revirw.find({'product': req.params.id})
      ///  console.log("review", review);

      ///  const alldata = {...findData.toObject(), "review": review}
        
        if(!pugtemplate){
             res.status(200).json({
            status: "success",
            data:findData
        })
        } else {

            res.status(200).render(pugtemplate, {
            //title: findData.name,
            data:findData  
        }) 
        }


    })
    
 
    // exports.deleteOne = (model, errorcode)=>
    //     catchBlock( async (req, res, next)=>{
    //         const findData = await model.findByIdAndDelete(req.params.id);
             
    //         if(!findData) next(new AppError("this item does not exist", 400))


    //         res.status(200).json({
    //             status: "deleted",
    //             data:{findData} 
    //         })
    
    //     })




        exports.deleteOne = (model, errorCode) =>
            catchBlock(async (req, res, next) => {
            
                const findData = await model.findByIdAndDelete(req.params.id);
          console.log(findData);
          
                if (!findData) {
                  return next(new AppError("This item does not exist", errorCode));
                }
          
                res.status(200).json({
                  status: "deleted",
                  data: { findData },
                });

            }); 




// exports.addProduct = catchBlock( async(req, res) => {
    
//     const dataAdd = await Product.create(req.body) 
//     res.status(201).json({
//      status:"success",
//      dataAdd
//     })
// })   