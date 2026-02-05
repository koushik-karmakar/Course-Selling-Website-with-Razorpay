import fs from "fs";
import { convertToHls } from "../video_process/ffmpeg.js";
import { uploadToS3 } from "../video_process/s3.js";
fs.mkdirSync("uploads", { recursive: true });
fs.mkdirSync("processed", { recursive: true });

const uploadVideo = async (request, reply) => {
  const data = await request.file();
  const videoId = Date.now();
  const tempVideoPath = `uploads/${videoId}-${data.filename}`;
  const outDir = `processed/${videoId}`;

  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(tempVideoPath);
    data.file.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  await convertToHls(tempVideoPath, outDir);
  const s3Prefix = `courses/course-1/${videoId}`;
  await uploadToS3(outDir, s3Prefix);

  reply.send({
    success: true,
    videoKey: `${s3Prefix}/master.m3u8`,
  });
};
export { uploadVideo };
