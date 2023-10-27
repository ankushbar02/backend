import express from "express";
import Note from "../model/NoteModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const noteRouter = express.Router();
dotenv.config();
// Read
noteRouter.use(cookieParser());
noteRouter.get("/all", async (req, res) => {
  const tok = req.headers.authorization;
  const token = tok.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        const response = await Note.find({ userId: decodedToken.id });
        if (response) {
          return res.status(200).json(response);
        } else return res.status(404).json({ error: "No notes found" });
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Read one data

noteRouter.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  const tok = req.headers.authorization;
  const token = tok.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SALT);
    const response = await Note.findOne({ userId: decodedToken.id, _id: id });

    if (response) {
      return res.json(response);
    } else {
      return res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Token verification failed" });
  }
});

noteRouter.post("/createnote", async (req, res) => {
  const { tittle, note } = req.body;
  const tok = req.headers.authorization;
  const token = tok.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        const response = await Note.create({
          tittle: tittle,
          note: note,
          userId: decodedToken.id,
        });
        if (response) {
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const tok = req.headers.authorization;
  const token = tok.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        const response = await Note.findOneAndDelete({
          userId: decodedToken.id,
          _id: id,
        });
        if (response) {
          return res.status(204).json(response);
        } else {
          return res.status(404).json({ error: "Note not found" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Update

noteRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const tok = req.headers.authorization;
  const token = tok.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.SALT, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      try {
        const response = await Note.findOneAndUpdate(
          { _id: id, userId: decodedToken.id },
          req.body,
          { new: true }
        );
        if (response) {
          return res.status(200).json(response);
        } else {
          return res.status(404).json({ error: "Note not found" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

export default noteRouter;
