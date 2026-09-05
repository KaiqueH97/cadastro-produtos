const express = require('express');
const rotasProdutos = require('./rotas/rotas-produtos');
const rotasUsuarios = require('./rotas/rotas-usuarios');

const aplicacao = express();

aplicacao.use(express.json());
aplicacao.use('/api/usuarios', rotasUsuarios);

function apresentarSistema(requisicao, resposta) {
  resposta.json({
    mensagem: 'Minha primeira etapa esta funcionando.'
  });
}

aplicacao.get('/', apresentarSistema);
aplicacao.use('/api/produtos', rotasProdutos);

module.exports = aplicacao;