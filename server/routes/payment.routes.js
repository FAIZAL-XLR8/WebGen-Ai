import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import {
  createCheckoutSession,
  verifyCheckoutSession,
  handleWebhook,
} from '../controllers/payment.controller.js';

const paymentRouter = express.Router();

// Webhook must receive raw body for signature verification — registered in index.js directly
// POST /api/payment/create-order  (protected)
paymentRouter.post('/create-order', isAuth, createCheckoutSession);

// POST /api/payment/verify  (protected)
paymentRouter.post('/verify', isAuth, verifyCheckoutSession);

export default paymentRouter;
