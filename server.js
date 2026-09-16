const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from the .env file.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Could not start the server:', error.message);
    process.exit(1);
  }
}

startServer();