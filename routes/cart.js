const express = require('express');

const authenticateToken = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} = require('../controllers/cartController');

const router = express.Router();

router.use(authenticateToken);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);

module.exports = router;