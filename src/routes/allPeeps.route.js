import express from "express";
import { allPeepsController } from "../controllers/allPeeps.controller.js";

const router = express.Router();

router.route(`/`).get(allPeepsController);

export { router as allPeeps };
