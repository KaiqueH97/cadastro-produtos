const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repositorioUsuarios = require('../repositorios/repositorio-usuarios');

async function realizarLogin(requisicao, resposta) {
  const { email, senha } = requisicao.body;

  if (
    typeof email !== 'string' ||
    typeof senha !== 'string' ||
    email.trim().length === 0 ||
    senha.length === 0
  ) {
    return resposta.status(400).json({
      mensagem: 'Informe o email e a senha.'
    });
  }

  try {
    const emailNormalizado = email.trim().toLowerCase();
    const usuario = await repositorioUsuarios.buscarPorEmail(
      emailNormalizado
    );

    if (!usuario) {
      return resposta.status(401).json({
        mensagem: 'Email ou senha incorretos.'
      });
    }

    const senhaEstaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaEstaCorreta) {
      return resposta.status(401).json({
        mensagem: 'Email ou senha incorretos.'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('A variavel JWT_SECRET nao foi configurada.');
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    return resposta.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro.message);

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel realizar o login.'
    });
  }
}

module.exports = {
  realizarLogin
};