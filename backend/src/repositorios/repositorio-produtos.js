const banco = require('../configuracao/conexao-banco');

const consultaBaseProdutos = `
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
`;

async function listarTodos() {
  const consulta = `
    ${consultaBaseProdutos}
    ORDER BY produtos.id DESC
  `;

  const [produtos] = await banco.execute(consulta);

  return produtos;
}

async function buscarPorId(id) {
  const consulta = `
    ${consultaBaseProdutos}
    WHERE produtos.id = ?
  `;

  const [produtos] = await banco.execute(consulta, [id]);

  return produtos[0] || null;
}

module.exports = {
  listarTodos,
  buscarPorId
};