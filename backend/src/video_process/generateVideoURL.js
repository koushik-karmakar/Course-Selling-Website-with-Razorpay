import fs from "fs";
import path from "path";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import dotenv from "dotenv";
dotenv.config();
const privateKey = fs.readFileSync(
  path.join(process.cwd(), "cloudfront_private.pem"),
  "utf8",
);

function generateSignedVideoUrl(videoPath) {
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const cleanPath = videoPath.startsWith("/") ? videoPath.slice(1) : videoPath;
  return getSignedUrl({
    url: `${cloudfrontDomain}/${cleanPath}`,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
}

export { generateSignedVideoUrl };
