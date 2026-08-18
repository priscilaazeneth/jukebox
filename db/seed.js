import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
}
import { faker } from "@faker-js/faker";
import client from "./client.js";
import { insertplaylists} from "./queries/playlists.js";
import { inserttracks} from "./queries/tracks.js";
import { insertplaylist_tracks } from "./queries/playlist_tracks.js";

const seedReservations = async()=>{
    const playlistIds = []
    const trackIds = []
    for(let i = 0; i<30;i++){
        const playlistname = await insertPlaylist (
           faker.music.genre () + "Mix"
           faker.lorem.sentence()
        )
          playlistIds.push(playlist.id);
      } 

       for (let i = 0; i < 30; i++) {
        const track = await insertTrack(
            faker.music.songName(),
             faker.number.int({ min: 120000, max: 300000 }) // duration_ms
    );
    trackIds.push(track.id);
  }
  for (let i = 0; i < 50; i++) {
    const playlistTrack = {
      playlist_id: playlistIds[Math.floor(Math.random() * playlistIds.length)],
      track_id: trackIds[Math.floor(Math.random() * trackIds.length)],
    };
    await insertPlaylistTrack(playlistTrack.playlist_id, playlistTrack.track_id);
  }
};

client.connect();
await seedJukebox();
client.end();
