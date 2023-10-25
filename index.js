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

app.use(express.json());
app.use(cookieParser());

// Enable CORS for specific origin and allow credentials
app.use(
  cors({
    origin: process.env.CLIENT_WEB, // Replace with your client's actual domain
    credentials: true,
  })
);

// Define a route to handle preflight requests (OPTIONS requests)
app.options('*', cors());
app.use(userRouter);
app.use(noteRouter);
// Your route handlers and other middleware go here...

// Start the Express server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
