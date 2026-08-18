import db from "#db/client";

/** @throws a Postgres error with code "23505" if this track is already in this playlist */
export async function createPlaylistTrack({ playlist_id, track_id }) {
  const sql = `
    INSERT INTO playlists_tracks (playlist_id, track_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [playlist_id, track_id]);
  return rows[0];
}

/** @returns all tracks belonging to the given playlist */
export async function getTracksByPlaylistId(playlistId) {
  const sql = `
    SELECT tracks.*
    FROM tracks
    JOIN playlists_tracks ON playlists_tracks.track_id = tracks.id
    WHERE playlists_tracks.playlist_id = $1
  `;
  const { rows } = await db.query(sql, [playlistId]);
  return rows;
}