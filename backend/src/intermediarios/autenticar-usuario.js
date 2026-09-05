const jwt = require('jsonwebtoken');

function autenticarUsuario(requisicao, resposta, proximo) {
  const cabecalhoAutorizacao = requisicao.headers.authorization;

  if (!cabecalhoAutorizacao) {
    return resposta.status(401).json({
      mensagem: 'Token de autenticacao nao informado.'
    });
  }

  const partes = cabecalhoAutorizacao.split(' ');

  if (
    partes.length !== 2 ||
    partes[0] !== 'Bearer' ||
    !partes[1]
  ) {
    return resposta.status(401).json({
      mensagem: 'Formato do token de autenticacao invalido.'
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('A variavel JWT_SECRET nao foi configurada.');

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel validar a autenticacao.'
    });
  }

  const token = partes[1];

  try {
    const dadosToken = jwt.verify(token, process.env.JWT_SECRET);

    requisicao.usuario = {
      id: dadosToken.id,
      nome: dadosToken.nome
    };

    return proximo();
  } catch (erro) {
    if (erro.name === 'TokenExpiredError') {
      return resposta.status(401).json({
        mensagem: 'O token de autenticacao expirou.'
      });
    }

    return resposta.status(401).json({
      mensagem: 'Token de autenticacao invalido.'
    });
  }
}

module.exports = autenticarUsuario;