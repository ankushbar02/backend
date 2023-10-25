// import express from "express";
// import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import noteRouter from "./routes/NoteRoute.js";
// import userRouter from "./routes/userRoutes.js";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();

// const app = express();
// mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");

// app.use(express.json());
// app.use(cookieParser());

// // Enable CORS for specific origin and allow credentials
// app.use(
//   cors({
//     origin: process.env.CLIENT_WEB, // Replace with your client's actual domain
//     credentials: true,
//   })
// );

// // Define a route to handle preflight requests (OPTIONS requests)
// app.options('*', cors());
// app.use(userRouter);
// app.use(noteRouter);
// // Your route handlers and other middleware go here...

// // Start the Express server
// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import noteRouter from "./routes/NoteRoute.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Enable CORS for specific origin and allow credentials
app.use(
  cors({
    origin: process.env.CLIENT_WEB,
    credentials: true,
    preflightContinue:true
  })
);

// Define a route to handle preflight requests (OPTIONS requests)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",  process.env.CLIENT_WEB);
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Your other middleware and route handlers go here...

// Connect to the MongoDB database
mongoose.connect(process.env.DB || "mongodb://localhost:27017/NotesDB");

// Use body-parser to parse incoming JSON requests
app.use(bodyParser.json());

// Use cookie-parser to parse incoming cookies
app.use(cookieParser());

// Use the noteRouter and userRouter to handle requests to /notes and /users respectively
app.use( noteRouter);
app.use( userRouter);

// Start the Express server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
