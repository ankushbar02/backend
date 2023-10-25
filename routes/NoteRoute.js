import express from "express";
import Note from "../model/NoteModel.js";
import jwt from "jsonwebtoken";
import cors from "cors"
const noteRouter = express.Router();

// Read

noteRouter.get("/all",async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "something_fancy_salt", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        // console.log(decodedToken.id);
        const response = await Note.find({ userId: decodedToken.id });
      //  console.log(response);
        if (response) res.json(response);
        else res.json({ status: false });
      }
    });
  } else {
    res.json({ status: false });
  }
});

// Read one data

noteRouter.get("/single/:id",async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "something_fancy_salt", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        // console.log(decodedToken.id);
        const response = await Note.find({ userId: decodedToken.id, _id: id });
        if (response) res.json(response);
        else res.json({ status: false });
      }
    });
  } else {
    res.json({ status: false });
  }
});

// Create
noteRouter.post("/createnote", async (req, res) => {
  const { tittle, note } = req.body;
  const token = req.cookies.jwt;
  // console.log(token);
  if (token) {
    jwt.verify(token, "something_fancy_salt", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        // console.log(decodedToken.id);
        const response = await Note.create({
          tittle: tittle,
          note: note,
          userId: decodedToken.id,
        });
        // console.log(response);
        if (response) res.json(response);
        else res.json({ status: false });
      }
    });
  } else {
    res.json({ status: false });
  }
});

// Delete
noteRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  
  const token = req.cookies.jwt; 
  // console.log(id,token);
  if (token) {
    jwt.verify(token, "something_fancy_salt", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        // console.log(decodedToken.id);
        const response = await Note.findOneAndDelete({
          userId: decodedToken.id,
          _id: id,
        });
        if (response) res.json(response);
        else res.json({ status: false });
      }
    });
  } else {
    res.json({ status: false });
  }
});

// Update
noteRouter.patch("/update/:id",async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "something_fancy_salt", async (err, decodedToken) => {
      if (err) {
        res.json({ status: false });
      } else {
        // console.log(decodedToken.id);
        const response = await Note.findOneAndUpdate(
          { _id: id, userId: decodedToken.id },
          req.body,
          { new: true }
        );
        if (response) res.json(response);
        else res.json({ status: false });
      }
    });
  } else {
    res.json({ status: false });
  }
});

export default noteRouter;
