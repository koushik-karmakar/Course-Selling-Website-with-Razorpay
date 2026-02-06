import { exec } from "child_process";
import fs from "fs";
import path from "path";

// function convertToHls(inputPath, outPutDir) {
//   return new Promise((resolve, reject) => {
//     ["v0", "v1", "v2", "v3"].forEach((v) => {
//       fs.mkdirSync(path.join(outPutDir, v), { recursive: true });
//     });

//     const cmd = `
//             ffmpeg -y -i "${inputPath}" \
//             -filter_complex "
//             [0:v]split=4[v1][v2][v3][v4];
//             [v1]scale=640:360[v1o];
//             [v2]scale=854:480[v2o];
//             [v3]scale=1280:720[v3o];
//             [v4]scale=1920:1080[v4o]
//             " \
//             -map [v1o] -map 0:a? -b:v:0 800k \
//             -map [v2o] -map 0:a? -b:v:1 1200k \
//             -map [v3o] -map 0:a? -b:v:2 2500k \
//             -map [v4o] -map 0:a? -b:v:3 5000k \
//             -c:v libx264 -preset fast -profile:v main \
//             -c:a aac -ac 2 -ar 48000 \
//             -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0 v:3,a:0" \
//             -f hls \
//             -hls_time 6 \
//             -hls_playlist_type vod \
//             -hls_flags independent_segments \
//             -hls_segment_filename "${outPutDir}/v%v/seg_%03d.ts" \
//             -master_pl_name master.m3u8 \
//             -progress pipe:1 \
//             -nostats \
//             "${outPutDir}/v%v/index.m3u8"
//             `;

//     exec(cmd, async (err, stdout) => {
//       const lines = stdout.toString().split("\n");
//       for (const line of lines) {
//         if (line.startsWith("out_time_ms")) {
//           const ms = Number(line.split("=")[1]);
//           const percent = Math.min(
//             Math.round((ms / totalDurationMs) * 100),
//             95,
//           );

//           await updateProgress(request, lessonId, "transcoding", percent);
//         }
//       }
//     });
//   });
// }

import { spawn } from "child_process";
import { updateProgress } from "../utils/progress_updater.js";

function convertToHls(request, inputPath, outPutDir, lessonId, durationMs) {
  return new Promise((resolve, reject) => {
    updateProgress(request, lessonId, "transcoding", 0);

    const ffmpeg = spawn("ffmpeg", cmd.split(" "), {
      stdio: ["ignore", "pipe", "pipe"],
    });

    ffmpeg.stdout.on("data", async (chunk) => {
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        if (line.startsWith("out_time_ms")) {
          const outTimeMs = Number(line.split("=")[1]);
          const percent = Math.min(
            Math.round((outTimeMs / durationMs) * 100),
            95,
          );

          await updateProgress(request, lessonId, "transcoding", percent);
        }
      }
    });

    ffmpeg.stderr.on("data", () => {
      // ignore stderr noise
    });

    ffmpeg.on("close", async (code) => {
      if (code === 0) {
        resolve();
      } else {
        await updateProgress(request, lessonId, "failed", 0);
        reject(new Error("FFmpeg failed"));
      }
    });
  });
}

export { convertToHls };
