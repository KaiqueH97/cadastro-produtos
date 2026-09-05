const bcrypt = require('bcrypt');
const repositorioUsuarios = require('../repositorios/repositorio-usuarios');

async function cadastrarUsuario(requisicao, resposta) {
  const { nome, email, senha } = requisicao.body;

  if (
    typeof nome !== 'string' ||
    nome.trim().length < 2 ||
    nome.trim().length > 120
  ) {
    return resposta.status(400).json({
      mensagem: 'O nome deve ter entre 2 e 120 caracteres.'
    });
  }

  if (
    typeof email !== 'string' ||
    email.trim().length > 160 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return resposta.status(400).json({
      mensagem: 'Informe um email valido.'
    });
  }

  if (
    typeof senha !== 'string' ||
    senha.length < 8 ||
    senha.length > 72
  ) {
    return resposta.status(400).json({
      mensagem: 'A senha deve ter entre 8 e 72 caracteres.'
    });
  }

  const nomeNormalizado = nome.trim();
  const emailNormalizado = email.trim().toLowerCase();

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await repositorioUsuarios.criarUsuario({
      nome: nomeNormalizado,
      email: emailNormalizado,
      senhaHash
    });

    return resposta.status(201).json(usuario);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY' || erro.errno === 1062) {
      return resposta.status(409).json({
        mensagem: 'Ja existe um usuario cadastrado com este email.'
      });
    }

    console.error('Erro ao cadastrar usuario:', erro.message);

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel cadastrar o usuario.'
    });
  }
}

module.exports = {
  cadastrarUsuario
};