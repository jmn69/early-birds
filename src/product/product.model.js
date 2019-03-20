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
  },
  { timestamps: true },
);

const ProductModel = mongoose.model('Product', ProductSchema);

ProductModel.add = productToAdd => productToAdd.save();

export default ProductModel;
