import { getPeepsService } from "../services/chitter.service.js";

export const allPeepsController = async (req, res) => {
  try {
    const peeps = await getPeepsService();
    res.json(peeps);
  } catch (e) {
    res.status(404).send(`Not found`);
  }
};
