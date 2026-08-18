import db from "#db/client";

export async function createPlaylist({ name, description }) {
  const sql = `
    INSERT INTO playlists (name, description)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [name, description]);
  return rows[0];
}

export async function getPlaylists() {
  const { rows } = await db.query("SELECT * FROM playlists");
  return rows;
}

export async function getPlaylist(id) {
  const { rows } = await db.query("SELECT * FROM playlists WHERE id = $1", [
    id,
  ]);
  return rows[0];
}