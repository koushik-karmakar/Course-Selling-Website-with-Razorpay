import { S3Client } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream, createReadStream } from "fs";
const s3_client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function downloadFromS3(s3Key, localPath) {
  console.log(`Downloading from S3: ${s3Key}`);

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
  });

  const response = await s3_client.send(command);
  const writeStream = createWriteStream(localPath);

  return new Promise((resolve, reject) => {
    response.Body.pipe(writeStream)
      .on("error", reject)
      .on("finish", () => {
        console.log("Download complete\n");
        resolve();
      });
  });
}

async function uploadToS3(
  localPath,
  s3Key,
  contentType = "application/octet-stream",
) {
  const fileStream = createReadStream(localPath);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: fileStream,
    ContentType: contentType,
  });

  await s3_client.send(command);
}

function getContentType(extension) {
  const types = {
    ".m3u8": "application/x-mpegURL",
    ".ts": "video/MP2T",
    ".mp4": "video/mp4",
  };
  return types[extension] || "application/octet-stream";
}

async function uploadHLSFiles(hlsFiles, courseId, videoId) {
  console.log(`Uploading ${hlsFiles.length} HLS files to S3...`);
  let uploaded = 0;
  for (const file of hlsFiles) {
    const s3Key = `hls-videos/${courseId}/${videoId}/${file.relativePath.replace(/\\/g, "/")}`;
    const contentType = getContentType(file.extension);
    await uploadToS3(file.absolutePath, s3Key, contentType);
    uploaded++;
    if (uploaded % 10 === 0 || uploaded === hlsFiles.length) {
      console.log(`   Uploaded ${uploaded}/${hlsFiles.length} files`);
    }
  }
  console.log("All HLS files uploaded\n");
  return `hls-videos/${courseId}/${videoId}/master.m3u8`;
}

export {
  s3_client,
  downloadFromS3,
  uploadToS3,
  uploadHLSFiles,
  getContentType,
};
