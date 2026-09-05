const express = require('express');
const rotasProdutos = require('./rotas/rotas-produtos');
const rotasUsuarios = require('./rotas/rotas-usuarios');
const rotasAutenticacao = require('./rotas/rotas-autenticacao');
const path = require('path');

const aplicacao = express();

aplicacao.use(express.json());
aplicacao.use('/api/usuarios', rotasUsuarios);
aplicacao.use('/api', rotasAutenticacao);

function redirecionarParaLogin(requisicao, resposta) {
  return resposta.redirect('/login.html');
}

aplicacao.get('/', redirecionarParaLogin);
aplicacao.use('/api/produtos', rotasProdutos);

const caminhoFrontend = path.join(__dirname, '../../frontend');

aplicacao.use(express.static(caminhoFrontend));

module.exports = aplicacao;