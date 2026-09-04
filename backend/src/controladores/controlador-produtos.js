const repositorioProdutos = require('../repositorios/repositorio-produtos');

async function listarProdutos(requisicao, resposta) {
  try {
    const produtos = await repositorioProdutos.listarTodos();

    resposta.status(200).json(produtos);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro.message);

    resposta.status(500).json({
      mensagem: 'Nao foi possivel listar os produtos.'
    });
  }
}

module.exports = {
  listarProdutos
};