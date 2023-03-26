import express from "express";
const router = express.Router();
import User from "../models/user.model.js";

router.route("/").post(async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && password === user.password) {
      res.status(200).send({ message: "Login successful", user });
    } else {
      return res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});

export { router as login };
