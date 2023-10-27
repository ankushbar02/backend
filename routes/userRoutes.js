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
        res.status(200).json({ token }); // 200 for successful login
      } else {
        res.status(401).json({ message: "Incorrect password" }); // 401 for Unauthorized
      }
    } else {
      res.status(404).json({ message: "User not found" }); // 404 for Not Found
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json({ errors, created: false }); // 500 for Internal Server Error
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    let { userName, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, password: hashPassword });
    const token = createToken(user._id);
    // .cookie("jwt", token, {
    //         httpOnly: false,
    //         maxAge: maxAge * 1000,
    //         sameSite: "none",
    //         secure: true,
    //       })
    // res.status(201).json({ userID: user._id });

    res.status(201).json({ token });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
});

userRouter.post("/home", async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ status: false }); // 401 for Unauthorized
      } else {
        const user = await User.findOne({ _id: decodedToken.id });
        if (user) {
          res
            .status(200)
            .json({ status: true, user: user.userName, id: user._id, token }); // 200 for OK
        } else {
          res.status(404).json({ status: false }); // 404 for Not Found
        }
      }
    });
  } else {
    res.status(402).json({ status: false }); // 401 for Unauthorized
  }
});

export default userRouter;
