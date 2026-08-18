import { Router } from "express";
import {
  getPlaylists,
  getPlaylist,
  createPlaylist,
} from "#db/queries/playlists";
import { getTrack } from "#db/queries/tracks";
import {
  getTracksByPlaylistId,
  createPlaylistTrack,
} from "#db/queries/playlists_tracks";

const playlistsRouter = Router();

playlistsRouter.param("id", async (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("id must be a number.");
  }
  const playlist = await getPlaylist(id);
  if (!playlist) return res.status(404).send("Playlist not found.");
  req.playlist = playlist;
  next();
});

playlistsRouter.get("/", async (req, res) => {
  res.json(await getPlaylists());
});

playlistsRouter.post("/", async (req, res) => {
  const { name, description } = req.body ?? {};
  if (!name || !description) {
    return res.status(400).send("name and description are required.");
  }
  const playlist = await createPlaylist({ name, description });
  res.status(201).json(playlist);
});

playlistsRouter.get("/:id", (req, res) => {
  res.json(req.playlist);
});

playlistsRouter.get("/:id/tracks", async (req, res) => {
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.json(tracks);
});

playlistsRouter.post("/:id/tracks", async (req, res) => {
  const { trackId } = req.body ?? {};

  if (!trackId) {
    return res.status(400).send("trackId is required.");
  }
  if (!/^\d+$/.test(String(trackId))) {
    return res.status(400).send("trackId must be a number.");
  }

  const track = await getTrack(trackId);
  if (!track) {
    return res.status(400).send("No track exists with that trackId.");
  }

  try {
    const playlistTrack = await createPlaylistTrack({
      playlist_id: req.playlist.id,
      track_id: trackId,
    });
    res.status(201).json(playlistTrack);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).send("Track is already in this playlist.");
    }
    throw err;
  }
});

export default playlistsRouter;