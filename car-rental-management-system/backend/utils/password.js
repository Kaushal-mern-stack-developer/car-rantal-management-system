const { promisify } = require("node:util");
const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require("node:crypto");

const scrypt = promisify(scryptCallback);

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${hash.toString("hex")}`;
};

const verifyPassword = async (password, storedPassword) => {
  const [algorithm, salt, storedHash] = storedPassword.split("$");
  if (algorithm !== "scrypt" || !salt || !storedHash) return false;

  const hash = Buffer.from(storedHash, "hex");
  const suppliedHash = await scrypt(password, salt, hash.length);
  return hash.length === suppliedHash.length && timingSafeEqual(hash, suppliedHash);
};

module.exports = { hashPassword, verifyPassword };
