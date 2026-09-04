const banco = require('../configuracao/conexao-banco');

async function listarTodos() {
  const consulta = `
    SELECT
      produtos.id,
      produtos.data_cadastro,
      usuarios.nome AS usuario,
      produtos.descricao,
      produtos.quantidade,
      produtos.valor
    FROM produtos
    INNER JOIN usuarios
      ON usuarios.id = produtos.usuario_id
    ORDER BY produtos.id DESC
  `;

  const [produtos] = await banco.execute(consulta);

  return produtos;
}

module.exports = {
  listarTodos
};