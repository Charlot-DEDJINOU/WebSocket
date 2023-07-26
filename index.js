const databaseConfig = require("./database/database");

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

function initializeDatabase() {
  const db = databaseConfig.createDb();
  databaseConfig.dbExist(db, (exist) => {
    if (exist === false) {
      databaseConfig.createTablemessage(db);
    } else {
      console.log("la table exite déjà");
      db.close();
      console.log("Connexion à la base de donnée fermée");
    }
  });
}

initializeDatabase() ;

app.get("/", (req, res) => {
  res.send("Websocket !!!");
});

app.listen(3001, () => {
  console.log("Serveur démarré sur le port 3000");
});
