import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";
ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
ffmpeg.setFfprobePath("C:\\ffmpeg\\bin\\ffprobe.exe");
const QUALITY_PRESETS = {
  "360p": {
    name: "360p",
    width: 640,
    height: 360,
    videoBitrate: "800k",
    audioBitrate: "96k",
    bandwidth: 800000,
  },
  "480p": {
    name: "480p",
    width: 854,
    height: 480,
    videoBitrate: "1400k",
    audioBitrate: "128k",
    bandwidth: 1400000,
  },
  "720p": {
    name: "720p",
    width: 1280,
    height: 720,
    videoBitrate: "2800k",
    audioBitrate: "128k",
    bandwidth: 2800000,
  },
  "1080p": {
    name: "1080p",
    width: 1920,
    height: 1080,
    videoBitrate: "5000k",
    audioBitrate: "192k",
    bandwidth: 5000000,
  },
};

const ENCODING_CONFIG = {
  videoCodec: "libx264",
  audioCodec: "aac",
  preset: "ultrafast",
  segmentDuration: 6,
  playlistType: "vod",
  format: "hls",
};

class FFmpegTranscoder {
  constructor(options = {}) {
    this.qualities = options.qualities || ["360p", "720p"];
    this.encodingConfig = { ...ENCODING_CONFIG, ...options.encodingConfig };
    this.validateQualities();
  }

  validateQualities() {
    for (const quality of this.qualities) {
      if (!QUALITY_PRESETS[quality]) {
        throw new Error(
          `Invalid quality preset: ${quality}. Available: ${Object.keys(QUALITY_PRESETS).join(", ")}`,
        );
      }
    }
  }

  async transcodeToHLS(inputVideoPath, outputDirectory) {
    console.log("Starting HLS transcoding...");
    console.log(`Input: ${inputVideoPath}`);
    console.log(`Output: ${outputDirectory}`);
    console.log(`Qualities: ${this.qualities.join(", ")}`);
    await this.validateInputFile(inputVideoPath);
    await fs.mkdir(outputDirectory, { recursive: true });
    const transcodedVariants = [];
    for (const qualityName of this.qualities) {
      const preset = QUALITY_PRESETS[qualityName];
      const variantInfo = await this.transcodeVariant(
        inputVideoPath,
        outputDirectory,
        preset,
      );
      transcodedVariants.push(variantInfo);
    }
    const masterPlaylistPath = await this.createMasterPlaylist(
      outputDirectory,
      transcodedVariants,
    );

    console.log("Transcoding completed successfully!");

    return {
      masterPlaylist: masterPlaylistPath,
      variants: transcodedVariants,
      outputDirectory,
    };
  }

  async validateInputFile(filePath) {
    try {
      await fs.access(filePath);
      const stats = await fs.stat(filePath);

      if (!stats.isFile()) {
        throw new Error("Input path is not a file");
      }

      console.log(
        `Input file validated (${(stats.size / 1024 / 1024).toFixed(2)} MB)`,
      );
    } catch (error) {
      throw new Error(`Input file validation failed: ${error.message}`);
    }
  }

  async transcodeVariant(inputPath, outputDir, preset) {
    console.log(`\n📹 Transcoding ${preset.name}...`);
    const variantDir = path.join(outputDir, preset.name);
    await fs.mkdir(variantDir, { recursive: true });
    const playlistPath = path.join(variantDir, "playlist.m3u8");
    const segmentPattern = path.join(variantDir, "segment%03d.ts");
    await this.runFFmpegCommand(
      inputPath,
      playlistPath,
      segmentPattern,
      preset,
    );

    const files = await fs.readdir(variantDir);
    const segmentFiles = files.filter((f) => f.endsWith(".ts"));

    console.log(`${preset.name} completed (${segmentFiles.length} segments)`);

    return {
      quality: preset.name,
      resolution: `${preset.width}x${preset.height}`,
      bandwidth: preset.bandwidth,
      playlistPath: path.relative(outputDir, playlistPath),
      segmentCount: segmentFiles.length,
    };
  }

  runFFmpegCommand(inputPath, playlistPath, segmentPattern, preset) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      ffmpeg(inputPath)
        .videoCodec(this.encodingConfig.videoCodec)
        .videoBitrate(preset.videoBitrate)
        .size(`${preset.width}x${preset.height}`)
        .audioCodec(this.encodingConfig.audioCodec)
        .audioBitrate(preset.audioBitrate)
        .outputOptions([
          `-preset ${this.encodingConfig.preset}`,
          `-hls_time ${this.encodingConfig.segmentDuration}`,
          `-hls_playlist_type ${this.encodingConfig.playlistType}`,
          `-hls_segment_filename ${segmentPattern}`,
          `-f ${this.encodingConfig.format}`,
          "-sc_threshold 0",
          "-g 48",
          "-keyint_min 48",
          "-movflags +faststart",
        ])
        .output(playlistPath)
        .on("start", (commandLine) => {
          console.log(`FFmpeg started`);
          console.log(`Command: ${commandLine}`);
        })
        .on("progress", (progress) => {
          if (progress.percent) {
            const percent = Math.round(progress.percent);
            process.stdout.write(`\r   Progress: ${percent}% `);
          }
        })
        .on("end", () => {
          const duration = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`\n  Completed in ${duration}s`);
          resolve();
        })
        .on("error", (error, stdout, stderr) => {
          console.error(`\n FFmpeg error: ${error.message}`);

          if (stderr) {
            console.error(`   Debug info: ${stderr.substring(0, 500)}...`);
          }

          reject(new Error(`FFmpeg transcoding failed: ${error.message}`));
        })
        .run();
    });
  }

  async createMasterPlaylist(outputDir, variants) {
    console.log("\nCreating master playlist...");

    const masterPlaylistPath = path.join(outputDir, "master.m3u8");
    let content = "#EXTM3U\n";
    content += "#EXT-X-VERSION:3\n\n";

    for (const variant of variants) {
      content += `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},RESOLUTION=${variant.resolution}\n`;
      content += `${variant.playlistPath}\n\n`;
    }

    await fs.writeFile(masterPlaylistPath, content, "utf-8");

    console.log(
      `Master playlist created: ${path.basename(masterPlaylistPath)}`,
    );

    return masterPlaylistPath;
  }

  async getVideoMetadata(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (error, metadata) => {
        if (error) {
          reject(new Error(`Failed to get video metadata: ${error.message}`));
        } else {
          resolve({
            duration: metadata.format.duration,
            size: metadata.format.size,
            bitrate: metadata.format.bit_rate,
            videoStream: metadata.streams.find((s) => s.codec_type === "video"),
            audioStream: metadata.streams.find((s) => s.codec_type === "audio"),
          });
        }
      });
    });
  }

  async getAllHLSFiles(outputDirectory) {
    const files = [];

    async function scanDirectory(dir) {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          await scanDirectory(fullPath);
        } else {
          files.push({
            absolutePath: fullPath,
            relativePath: path.relative(outputDirectory, fullPath),
            name: item.name,
            extension: path.extname(item.name),
          });
        }
      }
    }

    await scanDirectory(outputDirectory);
    return files;
  }
}
export { FFmpegTranscoder, QUALITY_PRESETS, ENCODING_CONFIG };
