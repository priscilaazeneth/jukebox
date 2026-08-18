import db from "#db/client";

export async function createTrack({ name, duration_ms }) {
  const sql = `
    INSERT INTO tracks (name, duration_ms)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [name, duration_ms]);
  return rows[0];
}

export async function getTracks() {
  const { rows } = await db.query("SELECT * FROM tracks");
  return rows;
}

export async function getTrack(id) {
  const { rows } = await db.query("SELECT * FROM tracks WHERE id = $1", [id]);
  return rows[0];
}