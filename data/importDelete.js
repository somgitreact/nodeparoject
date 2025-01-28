const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Product = require('../model/productModel')


dotenv.config({path:"./config.env"})



const DB = process.env.DATABASE

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=> console.log('connect'))

const file = JSON.parse(fs.readFileSync(`${__dirname}/product.json`, 'utf-8')) 
console.log("sdsdsdsdsd", file);
const importData = async ()=>{
    try {
      await Product.create(file) 
      console.log('Data successfully loaded!'); 
    } catch (error) {
        console.log(error);
        
    }
    process.exit()
}

const deleteData = async ()=>{
    try {
        await Product.deleteMany()
        console.log('Data successfully delete!'); 
      } catch (error) {
          console.log(error);   
      }
      process.exit()
}

if (process.argv[2] === '--import') {
    importData();
  } else if (process.argv[2] === '--delete') {
    deleteData();
  }