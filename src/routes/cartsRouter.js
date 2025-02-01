import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart } from '../controllers/cartsController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart); 

export default router;
