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
      resolve(Math.floor(Number(data) * 1000));
    });
    probe.on("error", reject);
  });
}
