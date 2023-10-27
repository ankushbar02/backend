import express from "express";
import Note from "../model/NoteModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const noteRouter = express.Router();
dotenv.config();
// Read
noteRouter.use(cookieParser())
noteRouter.get("/all", async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        // Token verification failed (e.g., expired or invalid token)
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        const response = await Note.find({ userId: decodedToken.id });
        if (response) {
          // Successfully fetched the notes
          
          return res.status(200).json(response); // 200 indicates a successful request
        } else {
          // Failed to fetch notes (no notes found)
          return res.status(404).json({ error: "No notes found" });
        }
      } catch (error) {
        // Handle any unexpected server errors
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    // Unauthorized access (no token provided)
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Read one data

noteRouter.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.jwt;

  // Check if the user is logged in
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the JWT token
  try {
    const decodedToken = jwt.verify(token, process.env.SALT);

    // Get the note data
    const response = await Note.findOne({ userId: decodedToken.id, _id: id });

    if (response) {
      // If the note exists, return it to the client
      return res.json(response);
    } else {
      // If the note is not found, return a 404 status
      return res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    // If the token verification fails, return an error message
    return res.status(500).json({ error: "Token verification failed" });
  }
});

noteRouter.post("/createnote", async (req, res) => {
  const { tittle, note } = req.body;
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        // Token verification failed (e.g., expired or invalid token)
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        const response = await Note.create({
          tittle: tittle,
          note: note,
          userId: decodedToken.id,
        });

        if (response) {
          // Successfully created the note
          return res.status(201).json(response); // 201 indicates resource created
        } else {
          // Failed to create the note
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } catch (error) {
        // Handle any unexpected server errors
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    // Unauthorized access (no token provided)
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Delete

noteRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        // Token verification failed (e.g., expired or invalid token)
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        const response = await Note.findOneAndDelete({
          userId: decodedToken.id,
          _id: id,
        });

        if (response) {
          // Successfully deleted the note
          return res.status(204).json(response); // 204 indicates no content after successful deletion
        } else {
          // Failed to delete the note (note not found)
          return res.status(404).json({ error: "Note not found" });
        }
      } catch (error) {
        // Handle any unexpected server errors
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    // Unauthorized access (no token provided)
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Update

noteRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        // Token verification failed (e.g., expired or invalid token)
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        const response = await Note.findOneAndUpdate(
          { _id: id, userId: decodedToken.id },
          req.body,
          { new: true }
        );

        if (response) {
          // Successfully updated the note
          return res.status(200).json(response); // 200 indicates a successful request
        } else {
          // Failed to update the note (note not found)
          return res.status(404).json({ error: "Note not found" });
        }
      } catch (error) {
        // Handle any unexpected server errors
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    // Unauthorized access (no token provided)
    return res.status(401).json({ error: "Unauthorized" });
  }
});

export default noteRouter;