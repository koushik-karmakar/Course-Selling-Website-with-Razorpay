import cors from "@fastify/cors";
import Fastify from "fastify";
import payRazorpay from "./plugins/razorpay.js";
const fastify = Fastify({ logger: true });
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN,
});

/* ===================== API ROUTES ===================== */
import { userRoutes, paymentRoute } from "./routes/users.route.js";
import dbPlugin from "./database/db.js";

fastify.register(dbPlugin)
fastify.register(userRoutes, {
  prefix: "/api/users",
});
fastify.register(paymentRoute, {
  prefix: "/payment",
});
fastify.register(payRazorpay);
export { fastify };
