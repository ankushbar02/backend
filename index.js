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
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_WEB}`); // Replace '*' with the specific domains allowed to access your API.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); 
  next();
});



app.use(userRouter);
app.use(noteRouter);
app.listen(4000)
