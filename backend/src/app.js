import cors from "@fastify/cors";
import Fastify from "fastify";
import secureSession from "@fastify/secure-session";
import payRazorpay from "./plugins/razorpay.js";
import multipart from "@fastify/multipart";
const fastify = Fastify({ logger: true });
await fastify.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

/* ===================== API ROUTES ===================== */
import { userRoutes, paymentRoute, videoRoute } from "./routes/users.route.js";
import dbPlugin from "./database/db.js";
import authSession from "./plugins/authSession.js";

fastify.register(secureSession, {
  key: Buffer.alloc(
    32,
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  ),
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
});
fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024,
  },
});
fastify.register(dbPlugin);
fastify.register(authSession);
fastify.register(payRazorpay);

fastify.register(userRoutes, {
  prefix: "/api/users",
});
fastify.register(videoRoute, {
  prefix: "/admin",
});
fastify.register(paymentRoute, {
  prefix: "/api/payment",
});

export { fastify };
