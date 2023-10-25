import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import noteRouter from "./routes/NoteRoute.js";
import userRouter from "./routes/userRoutes.js";

import dotenv from "dotenv";
const app = express();
dotenv.config();



app.use(bodyParser.json());


app.use(cookieParser());



app.options( process.env.CLIENT_WEB, (req, res) => {
  res.header('Access-Control-Allow-Origin',  process.env.CLIENT_WEB);
  res.header('Access-Control-Allow-Methods', ' POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});
app.options( `${process.env.CLIENT_WEB}/signup`, (req, res) => {
  res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_WEB}/signup`);
  res.header('Access-Control-Allow-Methods', ' POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});
app.options( `${process.env.CLIENT_WEB}/create`, (req, res) => {
  res.header('Access-Control-Allow-Origin',  `${process.env.CLIENT_WEB}/create`);
  res.header('Access-Control-Allow-Methods', ' POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); 
  res.status(204).send();
});
app.options( `${process.env.CLIENT_WEB}/update`, (req, res) => {
  res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_WEB}/update`);
  res.header('Access-Control-Allow-Methods', ' GET, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});
app.options( `${process.env.CLIENT_WEB}/readnotes`, (req, res) => {
  res.header('Access-Control-Allow-Origin',  `${process.env.CLIENT_WEB}/readnotes`);
  res.header('Access-Control-Allow-Methods', ' GET, DELETE, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(204).send();
});


mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");





app.use( noteRouter);
app.use( userRouter);


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
