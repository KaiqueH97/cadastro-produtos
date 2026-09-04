const repositorioProdutos = require('../repositorios/repositorio-produtos');

async function listarProdutos(requisicao, resposta) {
  const descricaoRecebida = requisicao.query.descricao ?? '';
  const usuarioRecebido = requisicao.query.usuario ?? '';
  const valorMinimoRecebido = requisicao.query.valor_minimo;
  const valorMaximoRecebido = requisicao.query.valor_maximo;
  const ordenarPorRecebido =
    requisicao.query.ordenar_por ?? 'data_cadastro';
  const direcaoRecebida =
    requisicao.query.direcao ?? 'desc';

  if (
    typeof descricaoRecebida !== 'string' ||
    typeof usuarioRecebido !== 'string' ||
    typeof ordenarPorRecebido !== 'string' ||
    typeof direcaoRecebida !== 'string' ||
    (
      valorMinimoRecebido !== undefined &&
      typeof valorMinimoRecebido !== 'string'
    ) ||
    (
      valorMaximoRecebido !== undefined &&
      typeof valorMaximoRecebido !== 'string'
    )
  ) {
    return resposta.status(400).json({
      mensagem: 'Os parametros da listagem sao invalidos.'
    });
  }

  const descricao = descricaoRecebida.trim();
  const usuario = usuarioRecebido.trim();

  if (descricao.length > 255) {
    return resposta.status(400).json({
      mensagem: 'O filtro de descricao deve ter no maximo 255 caracteres.'
    });
  }

  if (usuario.length > 120) {
    return resposta.status(400).json({
      mensagem: 'O filtro de usuario deve ter no maximo 120 caracteres.'
    });
  }

  let valorMinimo = null;
  let valorMaximo = null;

  if (
    valorMinimoRecebido !== undefined &&
    valorMinimoRecebido.trim() !== ''
  ) {
    valorMinimo = Number(valorMinimoRecebido);

    if (!Number.isFinite(valorMinimo) || valorMinimo < 0) {
      return resposta.status(400).json({
        mensagem: 'O valor minimo deve ser um numero nao negativo.'
      });
    }
  }

  if (
    valorMaximoRecebido !== undefined &&
    valorMaximoRecebido.trim() !== ''
  ) {
    valorMaximo = Number(valorMaximoRecebido);

    if (!Number.isFinite(valorMaximo) || valorMaximo < 0) {
      return resposta.status(400).json({
        mensagem: 'O valor maximo deve ser um numero nao negativo.'
      });
    }
  }

  if (
    valorMinimo !== null &&
    valorMaximo !== null &&
    valorMinimo > valorMaximo
  ) {
    return resposta.status(400).json({
      mensagem: 'O valor minimo nao pode ser maior que o valor maximo.'
    });
  }

  const colunasPermitidas = [
    'id',
    'data_cadastro',
    'usuario',
    'valor'
  ];

  if (!colunasPermitidas.includes(ordenarPorRecebido)) {
    return resposta.status(400).json({
      mensagem: 'A coluna de ordenacao informada nao e permitida.'
    });
  }

  const direcao = direcaoRecebida.toLowerCase();

  if (direcao !== 'asc' && direcao !== 'desc') {
    return resposta.status(400).json({
      mensagem: 'A direcao deve ser asc ou desc.'
    });
  }

  try {
    const produtos = await repositorioProdutos.listarTodos({
      descricao,
      usuario,
      valorMinimo,
      valorMaximo,
      ordenarPor: ordenarPorRecebido,
      direcao
    });

    return resposta.status(200).json(produtos);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro.message);

    return resposta.status(500).json({
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

async function excluirProduto(requisicao, resposta) {
  const id = Number(requisicao.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return resposta.status(400).json({
      mensagem: 'O ID deve ser um numero inteiro positivo.'
    });
  }

  try {
    const produtoFoiExcluido = await repositorioProdutos.excluirPorId(id);

    if (!produtoFoiExcluido) {
      return resposta.status(404).json({
        mensagem: 'Produto nao encontrado.'
      });
    }

    return resposta.status(204).send();
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro.message);

    return resposta.status(500).json({
      mensagem: 'Nao foi possivel excluir o produto.'
    });
  }
}

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
};