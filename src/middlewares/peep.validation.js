import { check } from "express-validator";

export const newPeepValidation = [
  check("peepAuthor").exists(),
  check("peepDateCreated").exists().isISO8601(),
  check("peepMessage").exists(),
];
