const mysql = require('mysql2/promise');

const banco = mysql.createPool({
  host: process.env.BANCO_HOST,
  port: Number(process.env.BANCO_PORTA),
  user: process.env.BANCO_USUARIO,
  password: process.env.BANCO_SENHA,
  database: process.env.BANCO_NOME,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = banco;