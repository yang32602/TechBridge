import express from 'express';
import * as paymentController from '../controllers/payment.controller.js'
const router = express.Router()

// Es como la factura de lo que el usuario va a pagar
router.post ('/create-order', paymentController.createOrder);

// Cuando el usuario acepta el pago y vuelve del return_url
router.get('/capture-order', paymentController.captureOrder);

// Cuando el usuario cancela y vuelve del cancel_url
router.get('/cancel-order', paymentController.cancelOrder);

export default router;