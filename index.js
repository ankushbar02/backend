import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import noteRouter from "./routes/NoteRoute.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
dotenv.config();

app.use(cors({
  origin: [process.env.CLIENT_WEB],
  methods: ["POST", "GET", "PATCH", "UPDATE", "DELETE"],
  credentials: true
}));

app.use(cookieParser()); 

app.use(bodyParser.json());

app.set("trust proxy", 1);

app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Cookie'
  );
  next();
});

mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");

app.use(noteRouter);
app.use(userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});