const express = require('express');
const controladorProdutos = require('../controladores/controlador-produtos');

const roteador = express.Router();

roteador.get('/', controladorProdutos.listarProdutos);

module.exports = roteador;