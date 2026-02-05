import {
  createOrder,
  verifyPayment,
} from "../controller/payment.controller.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  verifyPurchasedCourse,
} from "../controller/user.controller.js";
import { uploadVideo } from "../controller/video.controller.js";

const userRoutes = async (fastify) => {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
  fastify.post("/logout", logoutUser);
  fastify.get("/me", { preHandler: fastify.requireLogin }, verifyUser);
  fastify.get(
    "/verify_buy_course",
    {
      preHandler: fastify.requireLogin,
    },
    verifyPurchasedCourse,
  );
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

const videoRoute = async (fastify) => {
  fastify.post("/upload", uploadVideo);
};
export { userRoutes, paymentRoute, videoRoute };
