import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TodoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { 
      type: String, 
      enum: ["LOW", "MEDIUM", "HIGH"], 
      default: "MEDIUM" 
    },
    dueDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Todo", TodoSchema);