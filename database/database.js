const sqlite3 = require("sqlite3").verbose();

function createDb() {
  const db = new sqlite3.Database("./database/data.db");
  console.log("Connexion à la base de donnée");
  return db;
}

function dbExist(db, callback) {
  db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
    if (err) {
      console.error(err);
      callback(true);
    } else if (row) {
      console.log("La base de données existe déjà.");
      callback(true);
    } else {
      callback(false);
    }
  });
}

function createTablemessage(db) {
  db.run(
    `CREATE TABLE IF NOT EXISTS message (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destinateur TEXT,
      recepteur TEXT,
      message TEXT
    )`,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Table message créée avec succès.");
      }
    }
  );
}

module.exports = {
  createDb,
  createTablemessage,
  dbExist,
};
