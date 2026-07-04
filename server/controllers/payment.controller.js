import crypto from 'crypto';
import { PLANS } from '../config/plan.js';
import getRazorpay from '../config/razorpay.js';
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';

const confirmUserPayment = async (userId, planType, orderId, paymentId, signature, amountPaid) => {
  const plan = PLANS[planType];
  if (!plan) throw new Error(`Unknown plan type: ${planType}`);

  // Check if already paid to prevent double processing
  const existing = await Payment.findOne({ razorpayOrderId: orderId, paymentStatus: 'paid' });
  if (existing) {
    return;
  }

  // Update user credits and plan
  await User.findByIdAndUpdate(
    userId,
    {
      $inc: { credits: plan.credits },
      $set: { plan: plan.plan },
    },
    { new: false }
  );

  // Log payment details in database
  const paymentLog = new Payment({
    userId,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: signature,
    amount: amountPaid,
    currency: 'INR',
    credits: plan.credits,
    plan: plan.plan,
    paymentStatus: 'paid',
  });
  await paymentLog.save();
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.user._id;

    const plan = PLANS[planType];
    if (!plan || plan.price === 0) {
      return res.status(400).json({ success: false, message: 'Invalid paid plan.' });
    }

    const razorpay = getRazorpay();

    // Create a Razorpay Order (amount in paise)
    const options = {
      amount: Math.round(plan.price * 100),
      currency: 'INR',
      receipt: `receipt_${planType}_${userId.toString().slice(-6)}`,
      notes: {
        userId: userId.toString(),
        planType,
        credits: plan.credits,
        plan: plan.plan,
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_API_KEY,
      amount: order.amount,
      currency: order.currency,
      orderId: order.id,
      planType,
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(400).json({ success: false, message: 'Unable to complete Razorpay order request.' });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;
    const userId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planType) {
      return res.status(400).json({ success: false, message: 'All verification parameters are required.' });
    }

    const keySecret = process.env.RAZORPAY_API_SECRET;
    if (!keySecret) {
      throw new Error('RAZORPAY_API_SECRET is missing in .env.');
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Signature verification failed. Invalid request.' });
    }

    const plan = PLANS[planType];
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan type.' });
    }

    await confirmUserPayment(
      userId,
      planType,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan.price
    );

    return res.status(200).json({
      success: true,
      message: 'Payment verified. Credits added to your account.',
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({ success: false, message: 'Unable to complete Razorpay verification request.' });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('RAZORPAY_WEBHOOK_SECRET is missing in .env.');
    }

    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(req.body);
    const expectedSignature = shasum.digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid webhook signature.');
    }

    const payload = JSON.parse(req.body.toString());

    // Listen for captured payments or order completion
    if (payload.event === 'order.paid' || payload.event === 'payment.captured') {
      let orderId, paymentId, amountPaise;

      if (payload.event === 'order.paid') {
        const orderEntity = payload.payload.order.entity;
        orderId = orderEntity.id;
        amountPaise = orderEntity.amount;
      } else {
        const paymentEntity = payload.payload.payment.entity;
        orderId = paymentEntity.order_id;
        paymentId = paymentEntity.id;
        amountPaise = paymentEntity.amount;
      }

      if (orderId) {
        // Retrieve plan metadata from notes stored on the Razorpay order
        const razorpay = getRazorpay();
        const order = await razorpay.orders.fetch(orderId);
        const { userId, planType } = order.notes || {};

        if (userId && planType) {
          // Guard against double-processing: skip if payment already logged
          const existing = await Payment.findOne({ razorpayOrderId: orderId, paymentStatus: 'paid' });
          if (!existing) {
            await confirmUserPayment(
              userId,
              planType,
              orderId,
              paymentId || '',
              '',
              amountPaise / 100
            );
          }
        } else {
          console.warn('Razorpay webhook: missing userId or planType in order notes', order.notes);
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Razorpay webhook error:', err);
    return res.status(500).send(`Webhook process error: ${err.message}`);
  }
};
