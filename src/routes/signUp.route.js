import express from "express";
const router = express.Router();
import User from "../models/user.model.js";

router.route("/").post(async (req, res) => {
  const { email, username } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).send({ message: `Email already exists` });
      } else if (existingUser.username === username) {
        return res.status(409).send({ message: `Username already exists` });
      }
    }
    const user = new User(req.body);
    await user.save();
    res.status(200).send({ message: `Registration successful` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

export { router as signUp };
