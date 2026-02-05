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
    accessKeyId: "",
    secretAccessKey: "",
  },
});

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
          ContentType: file.endsWith(".m3u8")
            ? "application/x-mpegURL"
            : "video/MP2T",
        }),
      );
    }
  }
}

async function downloadFromS3(key, outputPath) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const { Body } = await s3.send(command);

  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath);
    Body.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}
export { uploadToS3, downloadFromS3 };
