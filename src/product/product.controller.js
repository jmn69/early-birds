import colourProximity from 'colour-proximity';

import Product from './product.model';

export const getAll = async (req, res, next) => {
  try {
    const allProducts = await Product.find({});
    res.json(allProducts);
  }
 catch (e) {
    next(e);
  }
};

/**
 * Get products where the color is the closest.
 * @property {number} req.query.limit - Limit number of products to be returned.
 * @returns {Product[]}
 */
export const getSimilarProductsById = async (req, res, next) => {
  const { limit = 10 } = req.query;
  let productToCompare = {};
  try {
    productToCompare = await Product.get(req.params.productId);
  }
 catch (e) {
    next(e);
  }

  try {
    const allProducts = await Product.findAllWithDominantColor();

    const productsWithProximity = allProducts.reduce((result, product) => {
      const proximity = colourProximity.proximity(
        productToCompare.dominantColor,
        product.dominantColor
      );

      if (product.id !== productToCompare.id) {
        result.push({ proximity, product });
      }

      return result;
    }, []);
    productsWithProximity.sort(compareProducts);

    res.json(productsWithProximity.slice(0, limit));
  }
 catch (e) {
    next(e);
  }
};

export const compareProducts = (a, b) => {
  if (a.proximity < b.proximity) return -1;
  if (a.proximity > b.proximity) return 1;
  return 0;
};
