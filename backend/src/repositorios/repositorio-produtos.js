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

async function criarProduto({
  usuarioId,
  descricao,
  quantidade,
  valor
}) {
  const consulta = `
    INSERT INTO produtos (
      usuario_id,
      descricao,
      quantidade,
      valor
    )
    VALUES (?, ?, ?, ?)
  `;

  const [resultado] = await banco.execute(consulta, [
    usuarioId,
    descricao,
    quantidade,
    valor
  ]);

  return buscarPorId(resultado.insertId);
}

async function atualizarPorId(id, {
  descricao,
  quantidade,
  valor
}) {
  const consulta = `
    UPDATE produtos
    SET
      descricao = ?,
      quantidade = ?,
      valor = ?
    WHERE id = ?
  `;

  const [resultado] = await banco.execute(consulta, [
    descricao,
    quantidade,
    valor,
    id
  ]);

  if (resultado.affectedRows === 0) {
    return null;
  }

  return buscarPorId(id);
}

async function excluirPorId(id) {
  const consulta = `
    DELETE FROM produtos
    WHERE id = ?
  `;

  const [resultado] = await banco.execute(consulta, [id]);

  return resultado.affectedRows > 0;
}

module.exports = {
  listarTodos,
  buscarPorId,
  criarProduto,
  atualizarPorId,
  excluirPorId
};