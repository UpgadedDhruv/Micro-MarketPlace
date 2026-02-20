import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectMongo } from './db.js';

const PORT = process.env.PORT || 4000;

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
