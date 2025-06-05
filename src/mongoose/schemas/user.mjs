import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: true,
    unique: false
  }
});

export const User = mongoose.model("User", userSchema);
