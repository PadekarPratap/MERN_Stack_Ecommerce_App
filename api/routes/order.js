import express from 'express'
import { admin, auth } from '../../middleware/authMiddleware.js'
import { createOrder, getAllOrders, getOrderDetails, getUserOrders, updateOrder } from '../controllers/order.js'

const router = express.Router()



router.post('/create', auth, createOrder)

router.get('/myorders', auth, getUserOrders)

router.get('/', auth, admin, getAllOrders)

router.get('/:orderId', auth, getOrderDetails)

router.put('/:id/update', auth, admin, updateOrder)

// router.put('/:orderId/pay', auth, updateOrderPay)

export default router