import express from "express";
import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRouter = express.Router();
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "something_fancy_salt", { expiresIn: maxAge });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // console.log(err);
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

userRouter.post("/login", async (req, res) => {
  
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName: userName });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = createToken(user._id);
        
        res
          .cookie("jwt", token, {
            httpOnly: false,
            maxAge: maxAge * 1000,
          })
          .status(201)
          .json({ userID: user._id });
          console.log(token);
      } else {
        throw new Error("incorrect password");
      }
    } else {
      throw new Error("incorrect email");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    let { userName, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, password: hashPassword });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ userID: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
});

userRouter.post("/", async (req, res) => {
  const token = req.cookies.jwt;
  // console.log(token);
  if (token) {
    jwt.verify(token, "something_fancy_salt", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        // console.log(decodedToken.id);
        const user = await User.findOne({ _id: decodedToken.id });
        if (user) res.json({ status: true, user: user.userName, id: user._id });
        else res.json({ status: false });
      }
    });
  } else {
    res.json({ status: false });
  }
});

export default userRouter;
