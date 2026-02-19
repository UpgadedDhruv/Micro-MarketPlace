import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const payload = {
    sub: user._id.toString(),
    email: user.email,
  }; 

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}; 

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ email, password });
    const token = createToken(user);

    res.status(201).json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};
