import fs from "fs";
import path from "path";
import { convertToHls } from "../video_process/ffmpeg.js";
import { uploadToS3 } from "../video_process/s3.js";
import { streamFile } from "../video_process/s3.js";
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

  if (!data || !course_id || !title) {
    return reply.code(400).send({ error: "Invalid upload data" });
  }

  const videoId = Date.now();
  const tempVideoPath = path.join("uploads", `${videoId}-${data.filename}`);
  const outDir = path.join("processed", `${videoId}`);

  const { rows } = await request.server.db.query(
    `
    INSERT INTO lessons (course_id, title, status)
    VALUES ($1, $2, 'processing')
    RETURNING id;
    `,
    [course_id, title],
  );

  const lessonId = rows[0].id;

  try {
    await streamFile(data.file, tempVideoPath);
    await convertToHls(tempVideoPath, outDir);
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

    fs.rmSync(tempVideoPath, { force: true });
    fs.rmSync(outDir, { recursive: true, force: true });

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
  }
};

export { uploadVideo };
