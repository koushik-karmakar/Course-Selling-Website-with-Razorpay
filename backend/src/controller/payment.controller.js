import crypto from "crypto";
import { ApiErrorHandle } from "../utils/ApiErrorHandler.js";

const createOrder = async (request, reply) => {
  try {
    const { courseId, amount } = request.body;
    const user = request.user;
    const parsedAmount = Number(String(amount).replace(/[^\d.]/g, ""));
    const amountInPaise = Math.round(parsedAmount * 100);
    console.log("user", `${user.id} ${amountInPaise}`);
    if (!courseId) {
      throw new ApiErrorHandle(400, "Course ID is required");
    }
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      throw new ApiErrorHandle(400, "Invalid amount");
    }

    const { rows: enrolled } = await request.server.db.query(
      "SELECT id FROM payments WHERE user_id = $1 AND course_id = $2 AND status = 'SUCCESS'",
      [user.id, courseId],
    );

    if (enrolled.length > 0) {
      throw new ApiErrorHandle(409, "You are already enrolled in this course");
    }

    const razorpayOrder = await request.server.razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `course_${courseId}_user_${user.id}_${Date.now()}`,
    });
    console.log(razorpayOrder);
    const payment = await request.server.db.query(
      `INSERT INTO public.payments(
  user_id, course_id, razorpay_order_id, amount, status)
  VALUES ($1, $2, $3, $4, $5)`,
      [user.id, courseId, razorpayOrder.id, amountInPaise, "CREATED"],
    );

    if (!razorpayOrder || !payment) {
      throw new ApiErrorHandle(500, "Payment Failed");
    }

    return reply.code(200).send({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return reply.code(error.statusCode || 500).send({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (request, reply) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = request.body;
    const user = request.user;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courseId ||
      !user
    ) {
      throw new ApiErrorHandle(400, "Missing payment details");
    }

    const { rows: payments } = await request.server.db.query(
      `SELECT id, status
       FROM payments
       WHERE razorpay_order_id = $1
         AND user_id = $2
         AND course_id = $3`,
      [razorpay_order_id, user.id, courseId],
    );

    if (payments.length === 0) {
      throw new ApiErrorHandle(404, "Payment record not found");
    }

    const payment = payments[0];

    if (payment.status === "SUCCESS") {
      return reply.send({
        success: true,
        message: "Payment already verified",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new ApiErrorHandle(400, "Invalid payment signature");
    }

    await request.server.db.query(
      `UPDATE payments
       SET razorpay_payment_id = $1,
           status = 'SUCCESS'
       WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id],
    );

    return reply.code(200).send({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return reply.code(error.statusCode || 500).send({
      success: false,
      message: error.message,
    });
  }
};

export { createOrder, verifyPayment };
