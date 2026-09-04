const banco = require('../configuracao/conexao-banco');

const colunasParaOrdenacao = {
  id: 'p.id',
  data_cadastro: 'p.data_cadastro',
  usuario: 'u.nome',
  valor: 'p.valor'
};

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

async function listarTodos({
  ordenarPor = 'data_cadastro',
  direcao = 'desc'
} = {}) {
  const colunaSql =
    colunasParaOrdenacao[ordenarPor] ||
    colunasParaOrdenacao.data_cadastro;

  const direcaoSql = direcao === 'asc' ? 'ASC' : 'DESC';

  const consulta = `
    SELECT
      p.id,
      p.data_cadastro,
      u.nome AS usuario,
      p.descricao,
      p.quantidade,
      p.valor
    FROM produtos AS p
    INNER JOIN usuarios AS u
      ON u.id = p.usuario_id
    ORDER BY ${colunaSql} ${direcaoSql}
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