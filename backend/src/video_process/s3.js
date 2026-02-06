import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const BUCKET = "code.master.app.bucket";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

function getContentType(file) {
  if (file.endsWith(".m3u8")) return "application/vnd.apple.mpegurl";
  if (file.endsWith(".ts")) return "video/mp2t";
  if (file.endsWith(".key")) return "application/octet-stream";
  return "application/octet-stream";
}

function getCacheControl(file) {
  if (file.endsWith(".m3u8")) return "no-cache";
  return "public, max-age=31536000";
}

async function uploadToS3(localDir, s3Prefix) {
  for (const file of fs.readdirSync(localDir)) {
    const fullPath = path.join(localDir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      await uploadToS3(fullPath, `${s3Prefix}/${file}`);
    } else {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: `${s3Prefix}/${file}`,
          Body: fs.createReadStream(fullPath),
          ContentType: getContentType(file),
          CacheControl: getCacheControl(file),
        }),
      );
    }
  }
}

async function downloadFromS3(key, outputPath) {
  const { Body } = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  );

  if (!Body || !Body.pipe) {
    throw new Error("Invalid S3 response body");
  }

  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath);
    Body.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
    Body.on("error", reject);
  });
}

async function streamFile(readStream, filePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);

    readStream.pipe(writeStream);

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
    readStream.on("error", reject);
  });
}

export { uploadToS3, downloadFromS3, streamFile };
