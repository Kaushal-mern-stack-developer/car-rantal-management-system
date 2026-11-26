const mongoose = require("mongoose");
const Car = require("../models/Car");
const User = require("../models/User");
const Booking = require("../models/Booking");
const { hashPassword } = require("../utils/password");

const createAdminFromEnvironment = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL && !ADMIN_PASSWORD) return;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env");
  }
  if (ADMIN_PASSWORD.length < 6) {
    throw new Error("ADMIN_PASSWORD must be at least 6 characters");
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const admin = await User.findOne({ email }) || await User.findOne({ role: "admin" });
  const updates = {
    name: process.env.ADMIN_NAME || "Admin",
    email,
    password: await hashPassword(ADMIN_PASSWORD),
    role: "admin",
  };

  if (admin) {
    await User.updateOne({ _id: admin._id }, { $set: updates }, { runValidators: true });
  } else {
    await User.create(updates);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Set MONGODB_URI in backend/.env");
  }
  if (!mongoUri.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI must be a MongoDB Atlas SRV connection string (mongodb+srv://...).");
  }

  try {
    await mongoose.connect(mongoUri);
    const existingCollections = await mongoose.connection.db
      .listCollections({}, { nameOnly: true })
      .toArray();
    const collectionNames = new Set(existingCollections.map(({ name }) => name));

    for (const model of [Car, User, Booking]) {
      if (!collectionNames.has(model.collection.name)) {
        await model.createCollection();
      }
    }

    await createAdminFromEnvironment();
    console.log("MongoDB connected");
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error });
  }
};

module.exports = connectDB;
