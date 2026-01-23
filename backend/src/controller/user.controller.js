import { ApiErrorHandle } from "../utils/ApiErrorHandler.js";
import db from "../database/db.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
const registerUser = async (request, reply) => {
  const { firstName, lastName, email, mobile, password } = request.body;
  if (!firstName || !lastName || !email || !mobile || !password) {
    throw new ApiErrorHandle(400, "All fields are required");
  }

  const [existedUser] = await db.query(
    "SELECT id FROM users WHERE email = ? OR number = ?",
    [email, mobile],
  );

  if (existedUser.length > 0) {
    throw new ApiErrorHandle(409, "User already exists");
  }

  const { hash, salt } = await hashPassword(password);
  const [result] = await db.query(
    `INSERT INTO users 
     (first_name, last_name, email, number, password, salt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, mobile, hash, salt],
  );

  return reply.code(201).send({
    success: true,
    message: "User registered successfully",
  });
};

const loginUser = async (request, reply) => {
  const { email, password } = request.body;
  if (!email || !password) {
    throw new ApiErrorHandle(400, "All fields are required");
  }

  const [row] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (row.length == 0) {
    throw new ApiErrorHandle(404, "User not found");
  }
  const user = row[0];

  const isPasswordMatch = await verifyPassword(
    password,
    user.password,
    user.salt,
  );

  if (!isPasswordMatch) {
    throw new ApiErrorHandle(401, "Incorrect password");
  }

  return reply.code(200).send({
    success: true,
    message: "Login successful",
    user: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      mobile: user.number,
    },
  });
};

const verifyUser = async (request, reply) => {
  const { email } = request.body;
  if (!email) {
    throw new ApiErrorHandle(400, "Invalid Email");
  }

  const [row] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

  if (row.length == 0) {
    throw new ApiErrorHandle(404, "User not found");
  }

  return reply.code(200).send({
    exists: true,
  });
};

export { registerUser, loginUser, verifyUser };
