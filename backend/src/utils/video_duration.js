import { spawn } from "child_process";
function getVideoDurationMs(inputPath) {
  return new Promise((resolve, reject) => {
    const probe = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ]);

    let data = "";

    probe.stdout.on("data", (d) => (data += d));
    probe.on("close", () => {
      const duration = Number(data);
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error("Invalid video duration"));
      }
      resolve(Math.floor(duration * 1000));
    });
    probe.on("error", reject);
  });
}
export { getVideoDurationMs };
