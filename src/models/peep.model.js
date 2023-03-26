import mongoose from "mongoose";

const peepSchema = new mongoose.Schema({
  peepAuthor: { type: String, required: true },
  peepDateCreated: { type: Date, default: Date.now, required: true },
  peepMessage: { type: String, required: true },
});

const Peep = mongoose.model(`Peep`, peepSchema, `peeps`);

export default Peep;
