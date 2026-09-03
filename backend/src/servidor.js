const aplicacao = require('./aplicacao');

const porta = 3000;

function avisarInicio() {
  console.log(`Servidor disponivel em http://localhost:${porta}`);
}

aplicacao.listen(porta, avisarInicio);
