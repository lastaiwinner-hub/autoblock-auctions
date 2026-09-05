'use strict';

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('./index');

const db = new Database(config.db.file);

// WAL lets readers run while a write is in flight — the difference between a
// responsive listing page and one that blocks every time a bid lands.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');
db.pragma('busy_timeout = 5000');

/** Apply schema.sql. Every statement is CREATE ... IF NOT EXISTS, so this is
 *  safe to run on every boot as well as from `npm run migrate`. */
function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  db.exec(sql);
}

/** Run a function inside a transaction, rolling back on any throw. */
function transaction(fn) {
  return db.transaction(fn);
}

module.exports = { db, migrate, transaction };
