// import sqlite3 from "sqlite3";

// let db = new sqlite3.Database("./bot_data.db", (err) => {
//   if (err) {
//     console.error("Error opening database:", err.message);
//   } else {
//     console.log(`SUCCESS! Connected to the SQLite database.`);
//   }
// });

// export function initializeDb() {
//   // Create a table called 'messages' to store user messages
//   db.run(
//     `CREATE TABLE IF NOT EXISTS voices (
//     voice TEXT PRIMARY KEY
// )`,
//     (err) => {
//       if (err) {
//         console.error("Error creating table:", err.message);
//       }
//     }
//   );
// }

// export function getAllVoices(callback) {
//   let query = `SELECT * FROM voices`;
//   return db.all(query, [], (err, rows) => {
//     if (err) {
//       console.error(`Error retrieving all voices:`, err.message);
//       return;
//     }
//     if (callback) callback(rows);
//   });
// }

// export function addVoice(voiceName) {
//   let query = `INSERT INTO voices (voice) VALUES (?)`;
//   db.run(query, [voiceName], function (err) {
//     if (err) {
//       console.error("Error adding this voice:", err.message);
//     } else {
//       // console.log(`Sticky added to ${channelId}`);
//     }
//   });
// }

// export function deleteVoices() {
//   let query = `DELETE FROM voices`;

//   db.run(query, function (err) {
//     if (err) {
//       console.error("Error deleting voices:", err.message);
//     } else {
//       // console.log(`Row(s) deleted: ${this.changes}`);
//     }
//   });
// }