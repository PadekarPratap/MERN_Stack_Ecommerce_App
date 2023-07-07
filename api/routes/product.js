import express from 'express'
import { createAReview, createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.js'
import { admin, auth } from '../../middleware/authMiddleware.js'
import singleUpload from '../../middleware/multer.js'


const router = express.Router()


// GET all products
router.get('/', getAllProducts)

// GET single product
router.get('/:id', getProduct)

// POST a new product 
router.post('/', auth, admin, singleUpload, createProduct)

// DELETE a product 
router.delete('/:id',auth, admin, deleteProduct)

// PUT update a product 
router.put('/:id', auth, admin, singleUpload, updateProduct)

// POST a new review
router.post('/:id/review/create', auth, createAReview)

export default router