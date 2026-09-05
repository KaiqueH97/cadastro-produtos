const express = require('express');
const rotasProdutos = require('./rotas/rotas-produtos');
const rotasUsuarios = require('./rotas/rotas-usuarios');
const rotasAutenticacao = require('./rotas/rotas-autenticacao');
const path = require('path');

const aplicacao = express();

aplicacao.use(express.json());
aplicacao.use('/api/usuarios', rotasUsuarios);
aplicacao.use('/api', rotasAutenticacao);


function apresentarSistema(requisicao, resposta) {
  resposta.json({
    mensagem: 'Minha primeira etapa esta funcionando.'
  });
}

aplicacao.get('/', apresentarSistema);
aplicacao.use('/api/produtos', rotasProdutos);

const caminhoFrontend = path.join(__dirname, '../../frontend');

aplicacao.use(express.static(caminhoFrontend));

module.exports = aplicacao;