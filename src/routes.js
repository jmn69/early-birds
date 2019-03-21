import express from 'express';

import productRoutes from './product/product.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/products', productRoutes);

export default router;
