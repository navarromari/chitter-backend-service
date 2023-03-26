import express from "express";

import { addPeepController } from "../controllers/addPeep.controller.js";
import { newPeepValidation } from "../middlewares/peep.validation.js";

const router = express.Router();

router.route("/").post(newPeepValidation, addPeepController);

export { router as addPeep };
