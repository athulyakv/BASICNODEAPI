const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'basicnodeapi',
  password: '103#athu2604@%',
  port: 5433,
});

module.exports = pool;
