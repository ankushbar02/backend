import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    tittle: String,
    note: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", notesSchema);

export default Note;
