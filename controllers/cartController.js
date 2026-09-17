const mongoose = require('mongoose');

const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');

    if (!cart) {
      return res.json({ user: req.user.userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch the cart.' });
  }
}

async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'A valid productId is required.' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const item = cart.items.find(
        cartItem => cartItem.product.toString() === productId
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Could not add the product to the cart.' });
  }
}

async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const item = cart.items.find(
      cartItem => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Product is not in the cart.' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Could not update the cart item.' });
  }
}

async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const originalItemCount = cart.items.length;
    cart.items = cart.items.filter(
      cartItem => cartItem.product.toString() !== productId
    );

    if (cart.items.length === originalItemCount) {
      return res.status(404).json({ message: 'Product is not in the cart.' });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Could not remove the cart item.' });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};