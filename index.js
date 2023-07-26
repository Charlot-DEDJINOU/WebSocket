const WebSocket = require('ws');
const databaseConfig = require('./database/database')

const server = new WebSocket.Server({ port: 3001 });

function initializeDatabase() {
  const db = databaseConfig.createDb();
  databaseConfig.dbExist(db, (exist) => {
    if (exist === false) {
      databaseConfig.createTablemessage(db);
    } else {
      console.log("les tables exitent déjà");
      db.close();
      console.log("Connexion à la base de donnée fermée");
    }
  });

  return db ;
}

initializeDatabase()

let clients = new Set();

server.on('connection', (ws) => {

  clients.add(ws);
  console.log('Nouvelle connexion WebSocket établie.');

  db = databaseConfig.createDb() ;

  db.all('SELECT * FROM message', (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages :', err);
    } else {
      
      rows.forEach((row) => {
        ws.send(JSON.stringify(row));
      });
    }
  });

  ws.on('message', (message) => {
    console.log('Message reçu :', message);

    message = JSON.parse(message) ;
    
    db.run('INSERT INTO message (destinateur, recepteur ,message) VALUES (?,?,?)', [message.destinateur , message.recepteur , message.message], (err) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement du message :', err);
      }
    });

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Connexion WebSocket fermée.');
  });
});

console.log('Serveur WebSocket en cours d\'exécution sur le port 3001');
