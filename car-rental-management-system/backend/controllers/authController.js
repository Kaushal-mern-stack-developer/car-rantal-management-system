const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/password");
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sendUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: makeToken(user._id),
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || !password) {
      res.status(400);
      throw new Error("Please fill all fields");
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      res.status(400);
      throw new Error("Email is already registered");
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    res.status(201).json(sendUser(user));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || typeof password !== "string" || !(await verifyPassword(password, user.password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    res.json(sendUser(user));
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
