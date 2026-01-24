import dotenv from "dotenv";
dotenv.config();
// import db from "./database/db.js";

import { fastify } from "./app.js";
const PORT = process.env.PORT || 3000;

/* -------------------- Database -------------------- */
// const dbConnection = async () => {
//   try {
//     const connection = await db.getConnection();
//     console.log("MySQL connected Successfully");
//     connection.release();
//   } catch (err) {
//     console.error("MySQL connection failed:", err.message);
//     process.exit(1);
//   }
// };

/* -------------------- Server -------------------- */
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
