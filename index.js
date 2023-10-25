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




app.use(cors({
  origin:process.env.CLIENT_WEB,
  credentials:true,
  preflightContinue:true
}))


// app.options( process.env.CLIENT_WEB, (req, res) => {
//   res.header('Access-Control-Allow-Origin',  process.env.CLIENT_WEB);
//   res.header('Access-Control-Allow-Methods', ' POST');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.status(204).send();
// });
// app.options( `${process.env.CLIENT_WEB}/signup`, (req, res) => {
//   res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_WEB}/signup`);
//   res.header('Access-Control-Allow-Methods', ' POST');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.status(204).send();
// });
// app.options( `${process.env.CLIENT_WEB}/create`, (req, res) => {
//   res.header('Access-Control-Allow-Origin',  `${process.env.CLIENT_WEB}/create`);
//   res.header('Access-Control-Allow-Methods', ' POST');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true'); 
//   res.status(204).send();
// });
// app.options( `${process.env.CLIENT_WEB}/update`, (req, res) => {
//   res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_WEB}/update`);
//   res.header('Access-Control-Allow-Methods', ' GET, PATCH');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.status(204).send();
// });
// app.options( `${process.env.CLIENT_WEB}/readnotes`, (req, res) => {
//   res.header('Access-Control-Allow-Origin',  `${process.env.CLIENT_WEB}/readnotes`);
//   res.header('Access-Control-Allow-Methods', ' GET, DELETE, POST');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.status(204).send();
// });

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
