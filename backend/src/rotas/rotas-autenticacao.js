const express = require('express');
const controladorAutenticacao = require(
  '../controladores/controlador-autenticacao'
);

const roteador = express.Router();

roteador.post('/login', controladorAutenticacao.realizarLogin);

module.exports = roteador;