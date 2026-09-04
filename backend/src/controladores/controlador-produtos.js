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

async function cadastrarProduto(requisicao, resposta) {
  const {
    usuario_id: usuarioId,
    descricao,
    quantidade,
    valor
  } = requisicao.body;

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    return resposta.status(400).json({
      mensagem: 'O usuario_id deve ser um numero inteiro positivo.'
    });
  }

  if (
    typeof descricao !== 'string' ||
    descricao.trim().length === 0 ||
    descricao.trim().length > 255
  ) {
    return resposta.status(400).json({
      mensagem: 'A descricao deve ter entre 1 e 255 caracteres.'
    });
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    return resposta.status(400).json({
      mensagem: 'A quantidade deve ser um numero inteiro nao negativo.'
    });
  }

  if (
    typeof valor !== 'number' ||
    !Number.isFinite(valor) ||
    valor < 0 ||
    valor > 99999999.99
  ) {
    return resposta.status(400).json({
      mensagem: 'O valor deve ser um numero entre 0 e 99999999.99.'
    });
  }

  try {
    const produto = await repositorioProdutos.criarProduto({
      usuarioId,
      descricao: descricao.trim(),
      quantidade,
      valor
    });

    return resposta.status(201).json(produto);
  } catch (erro) {
    const erroDeChaveEstrangeira =
      erro.code === 'ER_NO_REFERENCED_ROW' ||
      erro.code === 'ER_NO_REFERENCED_ROW_2' ||
      erro.errno === 1216 ||
      erro.errno === 1452;

    if (erroDeChaveEstrangeira) {
      return resposta.status(400).json({
        mensagem: 'O usuario informado nao existe.'
      });
    }

    console.error('Erro ao cadastrar produto:', erro.message);

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel cadastrar o produto.'
    });
  }
}

async function atualizarProduto(requisicao, resposta) {
  const id = Number(requisicao.params.id);
  const {
    descricao,
    quantidade,
    valor
  } = requisicao.body;

  if (!Number.isInteger(id) || id <= 0) {
    return resposta.status(400).json({
      mensagem: 'O ID deve ser um numero inteiro positivo.'
    });
  }

  if (
    typeof descricao !== 'string' ||
    descricao.trim().length === 0 ||
    descricao.trim().length > 255
  ) {
    return resposta.status(400).json({
      mensagem: 'A descricao deve ter entre 1 e 255 caracteres.'
    });
  }

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    return resposta.status(400).json({
      mensagem: 'A quantidade deve ser um numero inteiro nao negativo.'
    });
  }

  if (
    typeof valor !== 'number' ||
    !Number.isFinite(valor) ||
    valor < 0 ||
    valor > 99999999.99
  ) {
    return resposta.status(400).json({
      mensagem: 'O valor deve ser um numero entre 0 e 99999999.99.'
    });
  }

  try {
    const produto = await repositorioProdutos.atualizarPorId(id, {
      descricao: descricao.trim(),
      quantidade,
      valor
    });

    if (!produto) {
      return resposta.status(404).json({
        mensagem: 'Produto nao encontrado.'
      });
    }

    return resposta.status(200).json(produto);
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro.message);

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel atualizar o produto.'
    });
  }
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  cadastrarProduto,
  atualizarProduto
};