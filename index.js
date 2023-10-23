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
// const allowedOrigins = [, "http://localhost:3000"];

const corsOptions = {
  origin: process.env.CLIENT_WEB,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(userRouter);
app.use(noteRouter);
app.listen(4000);
