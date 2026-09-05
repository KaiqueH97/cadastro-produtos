const banco = require('../configuracao/conexao-banco');

async function buscarPorId(id) {
  const consulta = `
    SELECT
      id,
      nome,
      email,
      data_cadastro
    FROM usuarios
    WHERE id = ?
  `;

  const [usuarios] = await banco.execute(consulta, [id]);

  return usuarios[0] || null;
}

async function criarUsuario({ nome, email, senhaHash }) {
  const consulta = `
    INSERT INTO usuarios (
      nome,
      email,
      senha_hash
    )
    VALUES (?, ?, ?)
  `;

  const [resultado] = await banco.execute(consulta, [
    nome,
    email,
    senhaHash
  ]);

  return buscarPorId(resultado.insertId);
}

module.exports = {
  buscarPorId,
  criarUsuario
};