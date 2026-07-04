import Razorpay from 'razorpay';

// Helper to initialize Razorpay instance dynamically
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_API_KEY;
  const keySecret = process.env.RAZORPAY_API_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials (RAZORPAY_API_KEY / RAZORPAY_API_SECRET) are missing in .env.');
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export default getRazorpay;
