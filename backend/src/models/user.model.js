import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must not be more than 50 characters"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    passwordHash: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "seller"],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;