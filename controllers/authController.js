import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

// REGISTER
export const register =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      // CHECK USER
      const exists =
        await User.findOne({
          email,
        });

      if (exists) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      // HASH PASSWORD
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // CREATE USER
      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        });

      // TOKEN
      const token = jwt.sign(
        {
          id: user._id,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

      res.json({
        success: true,

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  export const login =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // FIND USER
      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(400).json({
          message:
            "Invalid Email",
        });
      }

      // CHECK PASSWORD
      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          message:
            "Wrong Password",
        });
      }

      // TOKEN
      const token = jwt.sign(
        {
          id: user._id,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

      res.json({
        success: true,

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };