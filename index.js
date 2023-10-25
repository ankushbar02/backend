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


// const allowedOrigins = [`${process.env.CLIENT_WEB}`,"http://localhost:4000/"]; 
// 

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:process.env.CLIENT_WEB,
  credentials:true
}));




app.use(userRouter);
app.use(noteRouter);
app.listen(process.env.PORT||4000)
