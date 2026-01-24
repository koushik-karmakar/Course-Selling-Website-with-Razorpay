import { createOrder } from "../controller/payment.controller.js";
import {
  registerUser,
  loginUser,
  verifyUser,
} from "../controller/user.controller.js";

const userRoutes = async (fastify) => {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
  fastify.post("/verify", verifyUser);
};

const paymentRoute = async (fastify) => {
  // fastify.post(
  //   "/create-order",
  //   // {
  //   //   preHandler: [fastify.authenticate],
  //   // },
  //   createOrder,
  // );
};

export { userRoutes, paymentRoute };
