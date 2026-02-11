import { ApiErrorHandle } from "../utils/ApiErrorHandler.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateSignedVideoUrl } from "../video_process/generateVideoURL.js";
const registerUser = async (request, reply) => {
  const { firstName, lastName, email, mobile, password } = request.body;
  if (!firstName || !lastName || !email || !mobile || !password) {
    throw new ApiErrorHandle(400, "All fields are required");
  }

  const { rows } = await request.server.db.query(
    "SELECT id FROM users WHERE email = $1 OR number = $2",
    [email, mobile],
  );

  if (rows.length > 0) {
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

  const { rows } = await request.server.db.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

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

  request.session.set("user", {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  });

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
  const user = request.user;
  return reply.send({
    user,
  });
};

const logoutUser = async (request, reply) => {
  request.session.delete();

  reply.send({
    success: true,
    message: "Logged out successfully",
  });
};

const verifyPurchasedCourse = async (request, reply) => {
  try {
    const user = request.user;

    if (!user) {
      throw new ApiErrorHandle(400, "User not found");
    }

    const { rows } = await request.server.db.query(
      "SELECT course_id FROM payments WHERE user_id = $1 AND status = 'SUCCESS'",
      [user.id],
    );

    const purchasedCourseIds = rows.map((row) => row.course_id);

    return reply.code(200).send({
      success: true,
      courseIds: purchasedCourseIds,
      total: purchasedCourseIds.length,
    });
  } catch (error) {
    return reply.code(error.statusCode || 500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const fetch_S3_Url = async (request, reply) => {
  try {
    const { courseId, video_url, title } = request.body;
    const user = request.user;
    if (!courseId || !video_url || !title || !user) {
      throw new ApiErrorHandle(400, "User not found" || "Invalid video");
    }
    const signed_URL = generateSignedVideoUrl(video_url);
    if (!signed_URL) {
      throw new ApiErrorHandle(400, "Fail to get Video");
    }
    const { rows } = await request.server.db.query(
      "SELECT course_id FROM lessons WHERE user_id = $1 AND status = 'CREATED'",
      [user.id],
    );
    if (rows.length === 0) {
      await request.server.db.query(
        `INSERT INTO lessons 
     (course_id, user_id, title, video_key, duration, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [courseId, user.id, title, video_url, 0, "CREATED"],
      );
    }

    return reply.code(200).send({
      success: true,
      signed_URL,
    });
  } catch (error) {
    return reply.code(error.statusCode || 500).send({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  verifyPurchasedCourse,
  fetch_S3_Url,
};
