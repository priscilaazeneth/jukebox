import { faker } from "@faker-js/faker";
import db from "#db/client";
import { createTrack } from "#db/queries/tracks";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const trackIds = [];
  for (let i = 0; i < 20; i++) {
    const track = await createTrack({
      name: faker.music.songName(),
      duration_ms: faker.number.int({ min: 120000, max: 300000 }),
    });
    trackIds.push(track.id);
  }

  const playlistIds = [];
  for (let i = 0; i < 10; i++) {
    const playlist = await createPlaylist({
      name: faker.music.genre() + " Mix",
      description: faker.lorem.sentence(),
    });
    playlistIds.push(playlist.id);
  }

  const usedPairs = new Set();
  let created = 0;
  while (created < 15) {
    const playlist_id =
      playlistIds[Math.floor(Math.random() * playlistIds.length)];
    const track_id = trackIds[Math.floor(Math.random() * trackIds.length)];
    const key = `${playlist_id}-${track_id}`;

    if (usedPairs.has(key)) continue;
    usedPairs.add(key);

    await createPlaylistTrack({ playlist_id, track_id });
    created++;
  }
}