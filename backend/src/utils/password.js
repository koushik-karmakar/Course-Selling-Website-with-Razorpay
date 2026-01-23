import crypto, { timingSafeEqual } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(crypto.scrypt);

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 64);

  return {
    hash: key.toString("hex"),
    salt,
  };
};

const verifyPassword = async (password, hash, salt) => {
  const key = await scryptAsync(password, salt, 64);
  const buffer = Buffer.from(hash, "hex");
  return timingSafeEqual(key, buffer);
};
export { hashPassword, verifyPassword };
