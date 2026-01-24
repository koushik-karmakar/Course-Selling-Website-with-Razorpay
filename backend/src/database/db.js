// MYSQL DATABASE 
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config();
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
// export default db;


// POSTGRESQL DATABASE 
import pkg from "pg";
import fp from "fastify-plugin";
const { Pool } = pkg;

async function dbPlugin(fastify) {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  })

  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected Successfully")
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection failed", error);
    process.exit(1);
  }

  fastify.decorate("db", pool);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });


}

export default fp(dbPlugin);