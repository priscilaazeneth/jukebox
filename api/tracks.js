import { Router } from "express";
import { getTracks, getTrack } from "#db/queries/tracks";

const tracksRouter = Router();

tracksRouter.param("id", async (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("id must be a number.");
  }
  const track = await getTrack(id);
  if (!track) return res.status(404).send("Track not found.");
  req.track = track;
  next();
});

tracksRouter.get("/", async (req, res) => {
  res.json(await getTracks());
});

tracksRouter.get("/:id", (req, res) => {
  res.json(req.track);
});

export default tracksRouter;