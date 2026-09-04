const express = require('express');
const controladorProdutos = require('../controladores/controlador-produtos');

const roteador = express.Router();

roteador.get('/', controladorProdutos.listarProdutos);
roteador.get('/:id', controladorProdutos.buscarProdutoPorId);
roteador.post('/', controladorProdutos.cadastrarProduto);
roteador.put('/:id', controladorProdutos.atualizarProduto);
roteador.delete('/:id', controladorProdutos.excluirProduto);

module.exports = roteador;