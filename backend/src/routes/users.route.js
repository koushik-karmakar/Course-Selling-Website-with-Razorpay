import { createOrder, verifyPayment } from "../controller/payment.controller.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
} from "../controller/user.controller.js";

const userRoutes = async (fastify) => {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
  fastify.post("/logout", logoutUser);
  fastify.get("/me", { preHandler: fastify.requireLogin }, verifyUser);
};

const paymentRoute = async (fastify) => {
  fastify.post(
    "/create-order",
    {
      preHandler: fastify.requireLogin,
    },
    createOrder,
  );
  fastify.post(
    "/verify",
    {
      preHandler: fastify.requireLogin,
    },
    verifyPayment,
  );
};

export { userRoutes, paymentRoute };
