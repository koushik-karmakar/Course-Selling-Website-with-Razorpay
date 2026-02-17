import { ApiErrorHandle } from "../utils/ApiErrorHandler.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateSignedVideoUrl } from "../video_process/generateVideoURL.js";
import { generateSignedHLSUrl } from "../video_process/generateVideoURL.js";
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
    const { courseId } = request.body;
    const user = request.user;

    if (!user) {
      throw new ApiErrorHandle(401, "User not authenticated");
    }

    if (!courseId) {
      throw new ApiErrorHandle(400, "Course ID is required");
    }

    const result = await request.server.db.query(
      `SELECT hls_master_playlist, transcoding_status FROM uploaded_videos WHERE course_id = $1 ORDER BY id DESC LIMIT 1`,
      [courseId],
    );

    if (result.rows.length === 0) {
      throw new ApiErrorHandle(404, "Video not found for this course");
    }

    const video = result.rows[0];

    if (video.transcoding_status !== "completed") {
      return reply.code(200).send({
        success: false,
        transcodingStatus: video.transcoding_status,
        message: "Video is still processing.",
      });
    }

    const hls_playlist = video.hls_master_playlist;

    if (!hls_playlist) {
      throw new ApiErrorHandle(404, "Video playlist not found");
    }

    console.log("HLS Playlist path:", hls_playlist);

    let videoKey = hls_playlist
      .replace(/^hls-videos\//, "")
      .replace(/\/master\.m3u8$/, "");

    console.log("Video Key:", videoKey);

    const signed_URL = generateSignedHLSUrl(videoKey);

    console.log("Signed URL generated:", signed_URL);

    if (!signed_URL) {
      throw new ApiErrorHandle(500, "Failed to generate signed URL");
    }

    return reply.code(200).send({
      success: true,
      signed_URL,
      transcodingStatus: video.transcoding_status,
    });
  } catch (error) {
    console.error("Error in fetch_S3_Url:", error);
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
