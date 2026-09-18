import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { env } from "../../config/env.js";
import { IUser } from "../../types/index.js";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  targetExam?: "JEE_MAIN" | "JEE_ADVANCED";
  targetYear?: number;
}): Promise<{ token: string; user: Partial<IUser> }> {
  const existingUser = await User.findOne({ email: data.email.toLowerCase().trim() });
  if (existingUser) {
    const error: any = new Error("An account with this email already exists");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const user = await User.create({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    passwordHash,
    targetExam: data.targetExam || "JEE_MAIN",
    targetYear: data.targetYear || new Date().getFullYear(),
    createdAt: new Date(),
  });

  const token = jwt.sign({ userId: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      targetExam: user.targetExam,
      targetYear: user.targetYear,
      createdAt: user.createdAt,
    },
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: Partial<IUser> }> {
  const user = await User.findOne({ email: data.email.toLowerCase().trim() });
  if (!user) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const token = jwt.sign({ userId: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      targetExam: user.targetExam,
      targetYear: user.targetYear,
      createdAt: user.createdAt,
    },
  };
}
