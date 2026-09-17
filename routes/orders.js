const express = require('express');

const authenticateToken = require('../middleware/auth');
const {
  checkout,
  getOrders,
  getOrderById
} = require('../controllers/orderController');

const router = express.Router();

router.use(authenticateToken);
router.post('/checkout', checkout);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;