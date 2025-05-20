import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: [/^[a-zA-Z0-9_]+$/, 'Username может содержать только буквы, цифры и подчеркивания']
  },
  status: {
    type: String,
    default: "Привет! Я использую это приложение",
    maxlength: 100
  },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;