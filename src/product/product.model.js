/* eslint-disable no-console */
import mongoose from 'mongoose';

/**
 * Product Schema
 */
const ProductSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    dominantColor: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * Product Model
 */

const ProductModel = mongoose.model('Product', ProductSchema);

ProductModel.add = productToAdd => productToAdd.save();

ProductModel.getAll = () => ProductModel.find({});

ProductModel.findWithoutDominantColor = () =>
  ProductModel.find({ dominantColor: { $exists: false } });

ProductModel.setDominantColor = (code, color) =>
  ProductModel.findOneAndUpdate(
    { productCode: code },
    { dominantColor: color },
    err => {
      if (err) {
        console.log(err);
      }
    }
  );

export default ProductModel;
