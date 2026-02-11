import fs from "fs";
import path from "path";
import { convertToHls } from "../video_process/ffmpeg.js";
import { uploadToS3 } from "../video_process/s3.js";
import { getVideoDurationMs } from "../utils/video_duration.js";
fs.mkdirSync("uploads", { recursive: true });
fs.mkdirSync("processed", { recursive: true });

const uploadVideo = async (request, reply) => {
  const parts = request.parts();

  let file;
  let course_id;
  let title;

  for await (const part of parts) {
    if (part.type === "file" && part.fieldname === "video") {
      file = part;
    } else if (part.type === "field") {
      if (part.fieldname === "course_id") course_id = part.value;
      if (part.fieldname === "title") title = part.value;
    }
  }

  if (!file || !course_id || !title) {
    return reply.code(400).send({ error: "Invalid upload data" });
  }

  const videoId = Date.now();
  const safeName = path.basename(file.filename);
  const tempVideoPath = path.join("uploads", `${videoId}-${safeName}`);
  const outDir = path.join("processed", `${videoId}`);

  const { rowCount } = await request.server.db.query(`SELECT 1 FROM lessons 
                                    WHERE status = 'processing'
                                    LIMIT 1`);
  if (rowCount > 0) {
    return reply.code(409).send({
      error: "Another video is processing. Please wait.",
    });
  }

  const { rows } = await request.server.db.query(
    `INSERT INTO lessons (course_id, title, status)
    VALUES ($1, $2, 'processing')
    RETURNING id;`,
    [course_id, title],
  );

  const lessonId = rows[0].id;

  try {
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tempVideoPath);
      file.file.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
      file.file.on("error", reject);
    });

    const durationMs = await getVideoDurationMs(tempVideoPath);

    await convertToHls(request, tempVideoPath, outDir, lessonId, durationMs);

    const s3Prefix = `courses/course-${course_id}/${lessonId}`;
    await uploadToS3(outDir, s3Prefix);
    const videoKey = `${s3Prefix}/master.m3u8`;

    await request.server.db.query(
      `
      UPDATE lessons
      SET video_key = $1, status = 'ready'
      WHERE id = $2;
      `,
      [videoKey, lessonId],
    );

    reply.send({ success: true, lessonId });
  } catch (err) {
    console.error("Video upload failed:", err);

    await request.server.db.query(
      `
      UPDATE lessons
      SET status = 'failed'
      WHERE id = $1;
      `,
      [lessonId],
    );

    reply.code(500).send({ error: "Video processing failed" });
  } finally {
    fs.rmSync(tempVideoPath, { force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
  }
};

export { uploadVideo };
