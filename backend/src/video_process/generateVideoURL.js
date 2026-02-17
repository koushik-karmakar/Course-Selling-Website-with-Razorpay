// import fs from "fs";
// import path from "path";
// import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
// import dotenv from "dotenv";
// dotenv.config();
// const privateKey = fs.readFileSync(
//   path.join(process.cwd(), "cloudfront_private.pem"),
//   "utf8",
// );

// function generateSignedVideoUrl(videoPath) {
//   const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
//   const cleanPath = videoPath.startsWith("/") ? videoPath.slice(1) : videoPath;
//   return getSignedUrl({
//     url: `${cloudfrontDomain}/${cleanPath}`,
//     keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
//     privateKey,
//     dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
//   });
// }

// export { generateSignedVideoUrl };
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
  const baseUrl = cloudfrontDomain.startsWith('https://')
    ? cloudfrontDomain
    : `https://${cloudfrontDomain}`;

  const cleanPath = videoPath.startsWith("/") ? videoPath.slice(1) : videoPath;

  return getSignedUrl({
    url: `${baseUrl}/${cleanPath}`,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
  });
}

function generateSignedHLSUrl(videoKey) {
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const baseUrl = cloudfrontDomain.startsWith('https://')
    ? cloudfrontDomain
    : `https://${cloudfrontDomain}`;

  const policy = {
    Statement: [
      {
        Resource: `${baseUrl}/hls-videos/${videoKey}/*`,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": Math.floor(Date.now() / 1000) + 3600,
          },
        },
      },
    ],
  };

  console.log("Policy:", JSON.stringify(policy, null, 2));

  return getSignedUrl({
    url: `${baseUrl}/hls-videos/${videoKey}/master.m3u8`,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey,
    policy: JSON.stringify(policy),
  });
}

export { generateSignedVideoUrl, generateSignedHLSUrl };