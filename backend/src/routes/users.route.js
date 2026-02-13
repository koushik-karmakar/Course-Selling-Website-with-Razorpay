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
  fetch_S3_Url,
} from "../controller/user.controller.js";
import { uploadRawVideo } from "../controller/video.controller.js";

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
  fastify.post(
    "/fetch-video-URL",
    { preHandler: fastify.requireLogin },
    fetch_S3_Url,
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
  fastify.post("/upload", uploadRawVideo);
};
export { userRoutes, paymentRoute, videoRoute };
