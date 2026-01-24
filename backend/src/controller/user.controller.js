import { ApiErrorHandle } from "../utils/ApiErrorHandler.js"
import { hashPassword, verifyPassword } from "../utils/password.js";
const registerUser = async (request, reply) => {
  const { firstName, lastName, email, mobile, password } = request.body;
  if (!firstName || !lastName || !email || !mobile || !password) {
    throw new ApiErrorHandle(400, "All fields are required");
  }

  const [existedUser] = await request.server.db.query(
    "SELECT id FROM users WHERE email = $1 OR number = $2",
    [email, mobile],
  );

  if (existedUser.length > 0) {
    throw new ApiErrorHandle(409, "User already exists");
  }

  const { hash, salt } = await hashPassword(password);
  await request.server.db.query(
    `INSERT INTO users 
     (first_name, last_name, email, number, password, salt)
     VALUES ($1, $2, $3, $4, $5, $6)`,
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

  const { rows } = await request.server.db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (rows.length === 0) {
    throw new ApiErrorHandle(404, "User not found");
  }
  const user = rows[0];

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

  const { rows } = await request.server.db.query("SELECT id FROM users WHERE email = $1", [email]);

  if (rows.length == 0) {
    throw new ApiErrorHandle(404, "User not found");
  }

  return reply.code(200).send({
    exists: true,
  });
};

export { registerUser, loginUser, verifyUser };
