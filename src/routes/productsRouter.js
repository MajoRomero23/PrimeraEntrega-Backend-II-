import express from 'express';
import { 
    getProducts, 
    getProductsById, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductsById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);
router.post('/generate', generateTestProducts);
router.delete('/deleteAll', deleteAllProducts);

export default router;
