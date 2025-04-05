const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, inventoryController.getInventory);
router.get('/:id', verifyToken, inventoryController.getInventory);
router.post('/', verifyToken, inventoryController.addItem);
router.delete('/:id', verifyToken, inventoryController.deleteItem);
router.put('/:id', verifyToken, inventoryController.updateItem);

module.exports = router;
