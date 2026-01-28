import dotenv from "dotenv";
dotenv.config();
import { fastify } from "./app.js";
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
startServer();
