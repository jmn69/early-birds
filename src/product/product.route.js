import express from 'express';
import { getSimilarProductsById, getAll } from './product.controller';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  /** GET /api/products - Get all products */
  .get(getAll);

router
  .route('/similar/:productId')
  /** GET /api/products/similar/:productId - Get similar products color by id */
  .get(getSimilarProductsById);

export default router;
