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


var whitelist = ['http:localhost:3000', process.env.CLIENT_WEB]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials:true,
  allowedHeaders:["x-render-origin-server","Content-Type","x-powered-by","Server"]
}
 
app.use(cors(corsOptions))

mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");


// Use the noteRouter and userRouter to handle requests to /notes and /users respectively
app.use( noteRouter);
app.use( userRouter);

// Start the Express server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
