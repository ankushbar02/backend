import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import noteRouter from "./routes/NoteRoute.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

dotenv.config();
// Use body-parser to parse incoming JSON requests
app.use(bodyParser.json());

// Use cookie-parser to parse incoming cookies
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_WEB);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers,Content-Length, Host, User-Agent, Accept, Accept-Encoding, Connection"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  


  next();
});
// Set preflight
app.options("*", (req, res) => {
  console.log("preflight");
  if (
    req.headers.origin === process.env.CLIENT_WEB &&
    allowMethods.includes(req.headers["access-control-request-method"]) &&
    allowHeaders.includes(req.headers["access-control-request-headers"])
  ) {
    console.log("pass");
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_WEB); // Add this line
    return res.status(204).send();
  } else {
    console.log("fail");
  }
});

mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");

// Use the noteRouter and userRouter to handle requests to /notes and /users respectively
app.use(noteRouter);
app.use(userRouter);

// Start the Express server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
