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

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//   origin:process.env.CLIENT_WEB,
//   credentials:true
// }));
console.log(process.env.CLIENT_WEB);
app.use(cors({ 
  origin: process.env.CLIENT_WEB,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials:true
}));


app.use(userRouter);
app.use(noteRouter);
app.listen(process.env.PORT||4000)
