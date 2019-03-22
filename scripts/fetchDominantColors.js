/* eslint-disable no-console */
/* eslint-disable no-loop-func */

import readline from 'readline';
import axios from 'axios';
import colorString from 'color-string';

import Product from '../src/product/product.model';
import connectToDb from '../db/connect';
import config from '../config/config';

Promise = require('bluebird'); // eslint-disable-line no-global-assign

connectToDb();

/**
 * Using a confirmation in console before requesting google vision api for n products in db
 * @property {Array} products - Array of Product
 */
const question = async products => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `You are about to request google vision for ${
      products.length
    } products, are you sure? (y/n)\r\n`,
    async answer => {
      if (answer === 'y') {
        try {
          let cpt = 0;
          /*
          Using bluebird map here to handle concurrency
          Google vision api started to show some errors with too many call at the same time
          */
          await Promise.map(
            products,
            async product => {
              try {
                await fetchImagePropVision(product);
                cpt += 1;
                console.log(
                  `(${cpt}/${
                    products.length
                  }) Product dominant color fetched: ${product.productCode}/${
                    product.title
                  }`
                );
              }
 catch (err) {
                console.log(`Product error: ${err}`);
              }
            },
            { concurrency: 10 }
          );

          process.exit(0);
        }
 catch (e) {
          console.log(e);
          process.exit(1);
        }
      }
 else if (answer === 'n') {
        process.exit(0);
      }
 else {
        console.log(
          "Congratulation you've just failed your response to a yes no question, try again :)\r\n"
        );
        question(products.length);
      }

      rl.close();
    }
  );
};

/**
 * Fetch image properties in the google vision api for a given product
 * @property {Product} product - The product to fetch
 */
const fetchImagePropVision = async product => {
  if (!product || !product.photo || !product.title || !product.productCode) {
    return Promise.reject(new Error('Product data are not complete'));
  }
  const payload = {
    requests: [
      {
        image: {
          source: {
            imageUri: `http:${product.photo}`,
          },
        },
        features: [{ type: 'IMAGE_PROPERTIES' }],
      },
    ],
  };
  let response = null;
  try {
    /*
    In a true production app, i'd would have used the env variable
    with a service account instead of an api key
    */
    response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${
        config.googleVisionApiKey
      }`,
      payload
    );
  }
 catch (e) {
    return Promise.reject(e);
  }

  if (response && response.status === 200 && response.data) {
    const colors =
      response.data.responses[0] &&
      response.data.responses[0].imagePropertiesAnnotation &&
      response.data.responses[0].imagePropertiesAnnotation.dominantColors &&
      response.data.responses[0].imagePropertiesAnnotation.dominantColors
        .colors;

    if (!colors) {
      return Promise.reject(
        new Error(
          `No colors object found in this response: ${JSON.stringify(
            response.data
          )}`
        )
      );
    }

    const scoresSum =
      colors.reduce((sum, color) => {
        if (!color || !color.score) {
          return sum;
        }
        return sum + color.score;
      }, 0) / 100;
    let dominantColor = null;
    let highestScore = 0;

    // Get the dominant color by comparing currentScore with the highest
    colors.forEach(color => {
      if (color && color.score) {
        const percent = color.score / scoresSum;
        if (percent > highestScore) {
          highestScore = percent;
          dominantColor = color;
        }
      }
    });

    if (!dominantColor || !dominantColor.color) {
      return Promise.reject(new Error('No dominant color found'));
    }

    const { red, green, blue } = dominantColor.color;
    return Product.setDominantColor(
      product.productCode,
      colorString.to.hex([red, green, blue])
    );
  }
  return Promise.reject(new Error('Something went wrong'));
};

(async () => {
  const products = await Product.findWithoutDominantColor();
  if (!products || products.length === 0) {
    console.log('no products found');
    process.exit(0);
  }
  question(products);
})();
