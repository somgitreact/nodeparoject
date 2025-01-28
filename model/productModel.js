const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    type: String,
    category: {
      type: String,
      enum: ["Fruits", "Herbs", "Medicine", "Fern", "Other"],
      default: "Other",
    },
    mainImg: {
      type: String,
      required: [true, "Product image is required"],
    },
    relatedImages: [String],
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (el) {
          return el < this.price;
        },
        message: "Discount must be lower than the original price",
      },
    },
    details: String,
    Locaion: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    careTips: {
      type: Array,
      default: [],
    },
    additionalInfo: String,
    faq: {
      type: Array,
      default: [],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    adminCost: {
      type: Number,
      default: 20,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Index for GeoJSON
productSchema.index({ proLocation: "2dsphere" });

productSchema.virtual('review', {
  ref:'Rating',
  foreignField:'product',
  localField:'_id'
})

  // productSchema.virtual('reviews', {
  //   ref: 'Rating',
  //   foreignField: 'product',
  //   localField: '_id',
  // });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
