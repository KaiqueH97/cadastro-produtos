const express = require('express');
const controladorProdutos = require('../controladores/controlador-produtos');
const autenticarUsuario = require('../intermediarios/autenticar-usuario');

const roteador = express.Router();

roteador.use(autenticarUsuario);

roteador.get('/', controladorProdutos.listarProdutos);
roteador.get('/:id', controladorProdutos.buscarProdutoPorId);
roteador.post('/', controladorProdutos.cadastrarProduto);
roteador.put('/:id', controladorProdutos.atualizarProduto);
roteador.delete('/:id', controladorProdutos.excluirProduto);

module.exports = roteador;