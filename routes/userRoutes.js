import express from "express";
import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const userRouter = express.Router();
userRouter.use(cookieParser());
const maxAge = 3 * 24 * 60 * 60;
dotenv.config();
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SALT, { expiresIn: maxAge });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "incorrect email") {
    errors.email = "Entered email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "Entered password is incorrect";
  }
  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }
  if (err.message === "User Exist") {
    errors.email = "Email is already registered";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

userRouter.get("/", async (req, res) => {
  res.json({ hi: "hello" });
});

userRouter.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName: userName });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = createToken(user._id);
        res.status(200).json({ token });
      } else {
        throw new Error("incorrect password");
      }
    } else {
      throw new Error("incorrect email");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json({ errors, created: false });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    let { userName, password } = req.body;

    const user = await User.findOne({ userName: userName });
    if (user) {
      throw new Error("User Exist");
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      user = await User.create({ userName, password: hashPassword });
      const token = createToken(user._id);
      res.status(201).json({ token });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
});

userRouter.post("/home", async (req, res) => {
  const tok = req.headers.authorization;
  const token = tok.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ status: false });
      } else {
        const user = await User.findOne({ _id: decodedToken.id });
        if (user) {
          res
            .status(200)
            .json({ status: true, user: user.userName, id: user._id, token });
        } else {
          res.status(404).json({ status: false });
        }
      }
    });
  } else {
    res.status(402).json({ status: false });
  }
});

export default userRouter;
