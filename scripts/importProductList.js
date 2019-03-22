/* eslint-disable no-console */

import fs from 'fs';
import csv from 'fast-csv';
import Product from '../src/product/product.model';

import connectToDb from '../db/connect';

connectToDb();

let filePath = 'statics/products_eb_test_technique.csv';
if (process.argv && process.argv.length > 2) {
  filePath = process.argv[2];
}

const stream = fs.createReadStream(filePath);

const productsFromCsv = [];

const csvStream = csv({ headers: true, delimiter: ';' })
  .on('data', async data => {
    // We dont need other data from the csv
    if (data.title && data.id && data.photo) {
      productsFromCsv.push({
        productCode: data.id,
        title: data.title,
        photo: data.photo,
      });
    }
  })
  .on('end', async () => {
    try {
      await Promise.all(
        productsFromCsv.map(async product => {
          const productToAdd = Product(product);
          try {
            const savedProduct = await Product.add(productToAdd);
            console.log(`Product added: ${savedProduct}`);
          } catch (err) {
            console.log(`Product error: ${err}`);
          }
        })
      );
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
    console.log('-------------');
    console.log(`${productsFromCsv.length} products added`);
    process.exit(0);
  });

stream.pipe(csvStream);
