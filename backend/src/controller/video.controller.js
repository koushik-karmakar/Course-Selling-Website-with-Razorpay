import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { s3_client } from "../video_process/s3.js";

const uploadRawVideo = async (request, reply) => {
  try {
    console.log("Upload request received");

    let fileBuffer;
    let fileName;
    let mimeType;
    let courseId;
    let title;

    const parts = request.parts();

    for await (const part of parts) {
      console.log("Processing part:", part.type, part.fieldname);

      if (part.type === "file") {
        fileName = part.filename;
        mimeType = part.mimetype;
        console.log("File found:", fileName, "Type:", mimeType);

        const chunks = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        fileBuffer = Buffer.concat(chunks);
        console.log("File buffer created, size:", fileBuffer.length, "bytes");
      } else {
        if (part.fieldname === "course_id") {
          courseId = part.value;
          console.log("Course ID:", courseId);
        } else if (part.fieldname === "title") {
          title = part.value;
          console.log("Title:", title);
        }
      }
    }

    if (!fileBuffer) {
      console.log("No file found in request");
      return reply.code(400).send({ error: "No file uploaded" });
    }

    const key = `raw-videos/${Date.now()}-${path.basename(fileName)}`;
    console.log("Uploading to S3 with key:", key);
    console.log("Bucket:", process.env.S3_BUCKET);
    console.log("Region:", process.env.S3_REGION);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    console.log("Starting S3 upload...");
    const result = await s3_client.send(command);
    console.log("S3 upload completed:", result);

    return reply.send({
      success: true,
      key,
      courseId,
      title,
    });
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Error stack:", error.stack);
    return reply.code(500).send({
      error: "Failed to upload to S3",
      message: error.message,
      details: error.stack,
    });
  }
};

export { uploadRawVideo };
