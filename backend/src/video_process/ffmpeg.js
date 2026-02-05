import {exec} from "child_process";
import path from "path";
import fs from "fs";

function convertToHls(inputPath, outPutDir) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(outPutDir, { recursive: true });

    const cmd = `ffmpeg -i "${inputPath}" \
                    -filter_complex "[0:v]split=4[v1][v2][v3][v4]; \
                    [v1]scale=640:360[v1o]; \
                    [v2]scale=854:480[v2o]; \
                    [v3]scale=1280:720[v3o]; \
                    [v4]scale=1920:1080[v4o]" \
                    -map [v1o] -map 0:a -b:v:0 800k \
                    -map [v2o] -map 0:a -b:v:1 1200k \
                    -map [v3o] -map 0:a -b:v:2 2500k \
                    -map [v4o] -map 0:a -b:v:3 5000k \
                    -c:a aac -f hls \
                    -hls_time 6 \
                    -hls_playlist_type vod \
                    -hls_segment_filename "${outPutDir}/v%v/seg_%03d.ts" \
                    -master_pl_name master.m3u8 \
                    "${outPutDir}/v%v/index.m3u8"`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export { convertToHls };
