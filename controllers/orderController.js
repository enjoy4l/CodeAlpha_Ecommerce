const mongoose = require('mongoose');

const Cart = require('../models/Cart');
const Order = require('../models/Order');

async function checkout(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cannot checkout with an empty cart.' });
    }

    const orderItems = cart.items.map(item => {
      if (!item.product) {
        throw new Error('A product in the cart no longer exists.');
      }

      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      totalAmount
    });

    await Cart.deleteOne({ _id: cart._id });
    res.status(201).json(order);
  } catch (error) {
    if (error.message === 'A product in the cart no longer exists.') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Could not complete checkout.' });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch orders.' });
  }
}

async function getOrderById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID.' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch the order.' });
  }
}

module.exports = {
  checkout,
  getOrders,
  getOrderById
};