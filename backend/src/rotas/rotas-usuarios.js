const express = require('express');
const controladorUsuarios = require('../controladores/controlador-usuarios');

const roteador = express.Router();

roteador.post('/', controladorUsuarios.cadastrarUsuario);

module.exports = roteador;