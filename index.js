import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import noteRouter from "./routes/NoteRoute.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");

// const allowedOrigins = [`${process.env.CLIENT_WEB}`];
//
// const allowedOrigins = [
//   process.env.CLIENT_WEB,
//   process.env.CLIENT_WEB + "/",
//   process.env.CLIENT_WEB + "/signup",
//   process.env.CLIENT_WEB + "/readnotes",
//   process.env.CLIENT_WEB + "/create/",
//   process.env.CLIENT_WEB + "/update/",
// ];
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://stickynote-mern.netlify.app");
  next();
});
app.use(
  cors({
    // origin:process.env.CLIENT_WEB,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// console.log("client on"+process.env.CLIENT_WEB);

app.use(userRouter);
app.use(noteRouter);
app.listen(process.env.PORT || 4000);
