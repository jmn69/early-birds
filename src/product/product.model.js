/* eslint-disable no-console */
import mongoose from 'mongoose';
import httpStatus from 'http-status';

import APIError from '../helpers/APIError';

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

/**
 * Add a new Product
 * @returns {Promise<void, APIError>}
 */
ProductModel.get = async id => {
  try {
    const productFound = await ProductModel.findById(id);
    if (productFound) {
      return Promise.resolve(productFound);
    }
    const err = new APIError('No such product exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
  }
 catch (e) {
    const err = new APIError(e, httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  }
};

/**
 * Add a new Product
 * @returns {Promise<void, APIError>}
 */
ProductModel.add = productToAdd => productToAdd.save();

/**
 * Find products with the property dominantColor
 * @returns {Promise<Product[], APIError>}
 */
ProductModel.findAllWithDominantColor = async () => {
  try {
    const productsFound = await ProductModel.find({
      dominantColor: { $exists: true },
    });
    return productsFound;
  }
 catch (e) {
    const err = new APIError(e, httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  }
};

/**
 * Find products without the property dominantColor
 * @returns {Promise<Product[], APIError>}
 */
ProductModel.findWithoutDominantColor = async () => {
  try {
    const productsFound = await ProductModel.find({
      dominantColor: { $exists: false },
    });
    return productsFound;
  }
 catch (e) {
    const err = new APIError(e, httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  }
};

/**
 * Set the dominant color on a Product
 * @param {String} code - The product code.
 * @param {String} color - The hexa color code.
 * @returns {Promise<Product, APIError>}
 */
ProductModel.setDominantColor = async (code, color) => {
  try {
    const foundAndUpdateProduct = await ProductModel.findOneAndUpdate(
      { productCode: code },
      { dominantColor: color },
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
    return foundAndUpdateProduct;
  }
 catch (e) {
    const err = new APIError(e, httpStatus.INTERNAL_SERVER_ERROR);
    return Promise.reject(err);
  }
};

export default ProductModel;
