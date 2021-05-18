const { Pool } = require('pg');

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const pool = new Pool();

const client = pool.connect();

module.exports = {
  db: pool,
  client,
};
