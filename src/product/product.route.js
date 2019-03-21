import express from 'express';
import { getSimilarProductsById } from './product.controller';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/similar/:productId')
  /** GET /api/products/similar/:productId - Get similar products color by id */
  .get(getSimilarProductsById);

export default router;
