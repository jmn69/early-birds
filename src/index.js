import '@babel/polyfill';
import express from 'express';

const DEV = process.env.NODE_ENV === 'development';
const port = DEV ? 3000 : 4030;
const app = express();

app.listen(port, () => {
  console.log(`BUILD COMPLETE -- Listening @  http://localhost:${port}/`);
});
