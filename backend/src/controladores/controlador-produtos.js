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

async function buscarProdutoPorId(requisicao, resposta) {
  const id = Number(requisicao.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return resposta.status(400).json({
      mensagem: 'O ID deve ser um numero inteiro positivo.'
    });
  }

  try {
    const produto = await repositorioProdutos.buscarPorId(id);

    if (!produto) {
      return resposta.status(404).json({
        mensagem: 'Produto nao encontrado.'
      });
    }

    return resposta.status(200).json(produto);
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro.message);

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel buscar o produto.'
    });
  }
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId
};