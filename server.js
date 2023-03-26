import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV}` });

import { allPeeps } from "./src/routes/allPeeps.route.js";
import { addPeep } from "./src/routes/addPeep.route.js";
import { signUp } from "./src/routes/signUp.route.js";
import { login } from "./src/routes/login.route.js";

const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

const dbConnect = async () => {
  console.log(`Connecting to DB @ ${process.env.DB_URI}`);
  await mongoose.connect(process.env.DB_URI);
  console.log(`Connected to DB @ ${process.env.DB_URI}`);
};

dbConnect().catch((err) => console.log(err));

app.use(express.json());
app.use(cors());
app.use(`/`, allPeeps);
app.use(`/add`, addPeep);
app.use(`/signup`, signUp);
app.use(`/login`, login);

const server = app.listen(port, host, () => {
  const SERVERHOST = server.address().address;
  const SERVERPORT = server.address().port;
  console.log(`Server is runnning on http://${SERVERHOST}:${SERVERPORT}`);
});

export default server;
