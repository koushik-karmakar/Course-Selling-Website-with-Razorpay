import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { s3_client } from "../video_process/s3.js";
import { processVideo } from "../video_process/transcodingPipeline.js";

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
    const fileSize = fileBuffer.length;
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

    const insertResult = await request.server.db.query(
      `
      INSERT INTO uploaded_videos (
        s3_key, 
        original_filename, 
        file_size, 
        mime_type, 
        course_id,  
        title, 
        upload_status,
        processing_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        key,
        fileName,
        fileSize,
        mimeType,
        courseId,
        title,
        "completed",
        "pending",
      ],
    );
    const uploadedVideo = insertResult.rows[0];
    console.log(`Video record saved to database (ID: ${uploadedVideo.id})\n`);

    // server start transcoding work
    startTranscoding(uploadedVideo.id, key, courseId, request.server.db);

    return reply.code(200).send({
      success: true,
      message:
        "Video uploaded successfully! Transcoding started in background.",
      video: {
        id: uploadedVideo.id,
        filename: uploadedVideo.original_filename,
        courseId: uploadedVideo.course_id,
        courseName: uploadedVideo.course_name,
        transcodingStatus: "pending",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return reply.code(500).send({
      error: "Failed to upload video",
      message: error.message,
    });
  }
};

async function startTranscoding(videoId, s3Key, courseId, db) {
  try {
    console.log(`\n========================================`);
    console.log(`Background transcoding started`);
    console.log(`Video ID: ${videoId}`);
    console.log(`========================================\n`);

    await db.query(
      `UPDATE uploaded_videos 
       SET processing_status = $1
       WHERE id = $2`,
      ["processing", videoId],
    );

    const result = await processVideo(s3Key, videoId, courseId);

    await db.query(
      `UPDATE uploaded_videos 
       SET hls_master_playlist = $1,
           hls_variants = $2,
           transcoding_status = $3,
           cloudfront_url = $4
       WHERE id = $5`,
      [
        result.masterPlaylist,
        JSON.stringify(result.variants),
        "completed",
        result.cloudfrontUrl,
        videoId,
      ],
    );

    console.log(
      `Video ${videoId} transcoding completed and database updated\n`,
    );
  } catch (error) {
    console.error(`Transcoding failed for video ${videoId}:`, error.message);

    await db.query(
      `UPDATE uploaded_videos 
       SET transcoding_status = $1, 
       WHERE id = $2`[("failed", videoId)],
    );
  }
}

const getTranscodingStatus = async (request, reply) => {
  try {
    const { videoId } = request.params;

    const result = await request.server.db.query(
      `SELECT 
        id,
        title,
        original_filename,
        transcoding_status,
        transcoding_started_at,
        transcoding_completed_at,
        cloudfront_url,
        hls_variants
       FROM uploaded_videos 
       WHERE id = $1`,
      [videoId],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ error: "Video not found" });
    }

    const video = result.rows[0];

    return reply.send({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        filename: video.original_filename,
        status: video.transcoding_status,
        error: video.transcoding_error,
        startedAt: video.transcoding_started_at,
        completedAt: video.transcoding_completed_at,
        streamUrl: video.cloudfront_url,
        qualities: video.hls_variants
          ? JSON.parse(video.hls_variants).map((v) => v.quality)
          : [],
      },
    });
  } catch (error) {
    return reply.code(500).send({
      error: "Failed to get status",
      message: error.message,
    });
  }
};

const getAllVideos = async (request, reply) => {
  try {
    const { courseId } = request.query;

    let query = `
      SELECT 
        id,
        title,
        original_filename,
        course_id,
        course_name,
        transcoding_status,
        cloudfront_url,
        uploaded_at,
        transcoding_completed_at
      FROM uploaded_videos
    `;

    const params = [];

    if (courseId) {
      query += " WHERE course_id = $1";
      params.push(courseId);
    }

    query += " ORDER BY uploaded_at DESC";

    const result = await request.server.db.query(query, params);

    return reply.send({
      success: true,
      videos: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    return reply.code(500).send({
      error: "Failed to fetch videos",
      message: error.message,
    });
  }
};

export { uploadRawVideo, getTranscodingStatus, getAllVideos };
