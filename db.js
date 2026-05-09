const database = require('better-sqlite3');
const db = database('contactos.db');
db.exec(`
 CREATE TABLE IF NOT EXISTS contacts (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    lastname TEXT NOT NULL,
    sex      TEXT DEFAULT 'other',
    phone    TEXT NOT NULL,
    city     TEXT DEFAULT '',
    address  TEXT DEFAULT ''
  )
`);

module.exports = db;