const mongoose = require('mongoose')


const maxPriceByTypeSchema = new mongoose.Schema({
    type: String,       // Product type
    maxPrice: Number    // Max price for this type
  });
  
  const MaxPriceByType = mongoose.model('MaxPriceByType', maxPriceByTypeSchema);

  module.exports = MaxPriceByType