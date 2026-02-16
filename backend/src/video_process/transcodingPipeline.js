import path from "path";
import fs from "fs/promises";
import os from "os";
import dotenv from "dotenv";
dotenv.config();
import { downloadFromS3, uploadHLSFiles } from "./s3.js";
import { FFmpegTranscoder } from "./videoTranscoder.js";
async function processVideo(s3Key, videoId, courseId) {
  console.log("\n ========================================");
  console.log("   Starting Video Processing Pipeline");
  console.log("========================================");
  console.log(`   Video ID: ${videoId}`);
  console.log(`   Course ID: ${courseId}`);
  console.log(`   S3 Key: ${s3Key}`);
  console.log("========================================\n");

  const tempDir = path.join(os.tmpdir(), `video-${videoId}-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  console.log(`Temp directory: ${tempDir}\n`);

  try {
    console.log("STEP 1: DOWNLOAD FROM S3");
    console.log("─────────────────────────");

    const inputVideo = path.join(tempDir, "original.mp4");
    await downloadFromS3(s3Key, inputVideo);

    console.log("STEP 2: TRANSCODE TO HLS");
    console.log("─────────────────────────");

    const hlsOutputDir = path.join(tempDir, "hls");

    const transcoder = new FFmpegTranscoder({
      qualities: ["360p", "480p", "720p", "1080p"],
    });

    const transcodingResult = await transcoder.transcodeToHLS(
      inputVideo,
      hlsOutputDir,
    );

    console.log("\nSTEP 3: COLLECT HLS FILES");
    console.log("─────────────────────────");

    const hlsFiles = await transcoder.getAllHLSFiles(hlsOutputDir);
    console.log(`Generated ${hlsFiles.length} HLS files\n`);

    console.log("STEP 4: UPLOAD TO S3");
    console.log("─────────────────────────");

    const masterPlaylistKey = await uploadHLSFiles(hlsFiles, courseId, videoId);

    console.log("STEP 5: CLEANUP");
    console.log("─────────────────────────");
    console.log("Removing temporary files...");

    await fs.rm(tempDir, { recursive: true, force: true });
    console.log("Cleanup complete\n");

    const cloudfrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${masterPlaylistKey}`;

    const result = {
      success: true,
      masterPlaylist: masterPlaylistKey,
      cloudfrontUrl: cloudfrontUrl,
      qualities: transcodingResult.variants.map((v) => v.quality),
      totalFiles: hlsFiles.length,
      variants: transcodingResult.variants,
    };

    console.log(" ========================================");
    console.log("   PIPELINE COMPLETED SUCCESSFULLY!");
    console.log("========================================");
    console.log(`   Master Playlist: ${result.masterPlaylist}`);
    console.log(`   CloudFront URL: ${result.cloudfrontUrl}`);
    console.log(`   Qualities: ${result.qualities.join(", ")}`);
    console.log(`   Total Files: ${result.totalFiles}`);
    console.log("========================================\n");

    return result;
  } catch (error) {
    console.error("\n========================================");
    console.error("   PIPELINE FAILED");
    console.error("========================================");
    console.error(`   Error: ${error.message}`);
    console.error("========================================\n");

    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}
async function getVideoMetadata(s3Key) {
  const tempDir = path.join(os.tmpdir(), `metadata-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });

  try {
    const tempVideo = path.join(tempDir, "temp.mp4");
    await downloadFromS3(s3Key, tempVideo);

    const transcoder = new FFmpegTranscoder();
    const metadata = await transcoder.getVideoMetadata(tempVideo);

    await fs.rm(tempDir, { recursive: true, force: true });

    return metadata;
  } catch (error) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}
export { processVideo, getVideoMetadata };
