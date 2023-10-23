import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import noteRouter from "./routes/NoteRoute.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv"
import cors from "cors";
dotenv.config()
const app = express();
mongoose.connect(process.env.DB ||"mongodb://localhost:27017/NotesDB");
const allowedOrigins = [process.env.CLIENT_WEB ||"http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}; 

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(userRouter);
app.use(noteRouter);
app.listen(4000);
