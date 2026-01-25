import { createOrder } from "../controller/payment.controller.js";
import {
  registerUser,
  loginUser,
  verifyUser,
} from "../controller/user.controller.js";

const userRoutes = async (fastify) => {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
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
};

export { userRoutes, paymentRoute };
