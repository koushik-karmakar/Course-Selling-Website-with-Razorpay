import Razorpay from "razorpay";
import fp from "fastify-plugin";
async function payRazorpay(fastify) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in environment variables");
  }
  fastify.decorate(
    "razorpay",
    new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    }),
  );
}
export default fp(payRazorpay);
