const express = require('express');

const aplicacao = express();

function apresentarSistema(requisicao, resposta) {
  resposta.json({
    mensagem: 'Minha primeira etapa esta funcionando.'
  });
}

aplicacao.get('/', apresentarSistema);

module.exports = aplicacao;
