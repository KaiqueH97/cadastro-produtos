const token = localStorage.getItem('token');
const usuarioArmazenado = localStorage.getItem('usuario');

const nomeUsuario = document.querySelector('#nome-usuario');
const botaoSair = document.querySelector('#botao-sair');
const botaoNovoProduto = document.querySelector('#botao-novo-produto');
const formularioProduto = document.querySelector('#formulario-produto');
const tituloFormulario = document.querySelector('#titulo-formulario');
const campoDescricao = document.querySelector('#descricao');
const campoQuantidade = document.querySelector('#quantidade');
const campoValor = document.querySelector('#valor');
const botaoCancelar = document.querySelector('#botao-cancelar');
const botaoSalvar = document.querySelector('#botao-salvar');
const mensagemFormulario = document.querySelector('#mensagem-formulario');
const mensagemListagem = document.querySelector('#mensagem-listagem');
const containerTabela = document.querySelector('#container-tabela');
const corpoTabela = document.querySelector('#corpo-tabela-produtos');
const modalExclusao = document.querySelector('#modal-exclusao');
const nomeProdutoExclusao = document.querySelector('#nome-produto-exclusao');
const mensagemExclusao = document.querySelector('#mensagem-exclusao');
const botaoCancelarExclusao = document.querySelector('#botao-cancelar-exclusao');
const botaoConfirmarExclusao = document.querySelector('#botao-confirmar-exclusao');

let produtoEmEdicaoId = null;
let produtoPendenteExclusao = null;
let botaoExclusaoPendente = null;

function encerrarSessao() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');

  window.location.replace('/login.html');
}

function mostrarNomeUsuario() {
  try {
    const usuario = JSON.parse(usuarioArmazenado);

    nomeUsuario.textContent = usuario?.nome
      ? `Olá, ${usuario.nome}`
      : 'Usuário autenticado';
  } catch (erro) {
    nomeUsuario.textContent = 'Usuário autenticado';
  }
}

function formatarData(data) {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(dataConvertida);
}

function formatarValor(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return '-';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numero);
}

function criarCelula(valor, nomeClasse = '') {
  const celula = document.createElement('td');

  celula.textContent = valor;

  if (nomeClasse) {
    celula.classList.add(nomeClasse);
  }

  return celula;
}

function criarCelulaAcoes(produto) {
  const celula = document.createElement('td');
  const grupoAcoes = document.createElement('div');
  const botaoEditar = document.createElement('button');
  const botaoExcluir = document.createElement('button');

  celula.classList.add('celula-acoes');
  grupoAcoes.classList.add('grupo-acoes');

  botaoEditar.type = 'button';
  botaoEditar.textContent = 'Editar';
  botaoEditar.classList.add('botao-tabela', 'botao-editar');

  botaoEditar.addEventListener('click', () => {
    abrirFormularioEdicao(produto);
  });

  botaoExcluir.type = 'button';
  botaoExcluir.textContent = 'Excluir';
  botaoExcluir.classList.add('botao-tabela', 'botao-excluir');

  botaoExcluir.addEventListener('click', () => {
  abrirModalExclusao(produto, botaoExcluir);
  });

  grupoAcoes.append(botaoEditar, botaoExcluir);
  celula.appendChild(grupoAcoes);

  return celula;
}

function mostrarMensagemFormulario(texto, tipo = '') {
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = 'mensagem';

  if (tipo) {
    mensagemFormulario.classList.add(`mensagem-${tipo}`);
  }

  mensagemFormulario.hidden = texto.length === 0;
}

function abrirFormularioCadastro() {
  produtoEmEdicaoId = null;
  formularioProduto.reset();
  tituloFormulario.textContent = 'Novo produto';
  botaoSalvar.textContent = 'Salvar produto';
  formularioProduto.hidden = false;
  mostrarMensagemFormulario('');
  campoDescricao.focus();
}

function abrirFormularioEdicao(produto) {
  produtoEmEdicaoId = produto.id;

  tituloFormulario.textContent = `Editar produto #${produto.id}`;
  campoDescricao.value = produto.descricao;
  campoQuantidade.value = produto.quantidade;
  campoValor.value = Number(produto.valor).toFixed(2);
  botaoSalvar.textContent = 'Salvar alterações';

  formularioProduto.hidden = false;
  mostrarMensagemFormulario('');

  formularioProduto.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  campoDescricao.focus();
}

function fecharFormulario() {
  produtoEmEdicaoId = null;
  formularioProduto.reset();
  formularioProduto.hidden = true;
  tituloFormulario.textContent = 'Novo produto';
  botaoSalvar.textContent = 'Salvar produto';
  mostrarMensagemFormulario('');
}

function exibirProdutos(produtos) {
  corpoTabela.replaceChildren();

  if (produtos.length === 0) {
    containerTabela.hidden = true;
    mensagemListagem.hidden = false;
    mensagemListagem.className = 'mensagem-listagem';
    mensagemListagem.textContent = 'Nenhum produto cadastrado.';
    return;
  }

  const fragmento = document.createDocumentFragment();

  produtos.forEach((produto) => {
    const linha = document.createElement('tr');

    linha.append(
      criarCelula(produto.id),
      criarCelula(formatarData(produto.data_cadastro)),
      criarCelula(produto.usuario),
      criarCelula(produto.descricao),
      criarCelula(produto.quantidade, 'celula-numero'),
      criarCelula(formatarValor(produto.valor), 'celula-valor'),
      criarCelulaAcoes(produto)
    );

    fragmento.appendChild(linha);
  });

  corpoTabela.appendChild(fragmento);
  mensagemListagem.hidden = true;
  containerTabela.hidden = false;
}

async function carregarProdutos() {
  mensagemListagem.hidden = false;
  mensagemListagem.className = 'mensagem-listagem';
  mensagemListagem.textContent = 'Carregando produtos...';
  containerTabela.hidden = true;

  try {
    const resposta = await fetch('/api/produtos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (resposta.status === 401) {
      encerrarSessao();
      return;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.mensagem || 'Nao foi possivel carregar os produtos.'
      );
    }

    if (!Array.isArray(dados)) {
      throw new Error('A resposta da listagem possui formato invalido.');
    }

    exibirProdutos(dados);
  } catch (erro) {
    mensagemListagem.hidden = false;
    mensagemListagem.className = 'mensagem-listagem mensagem-erro';
    mensagemListagem.textContent = erro.message;
    containerTabela.hidden = true;
  }
}

async function salvarProduto(evento) {
  evento.preventDefault();

  const estaEditando = produtoEmEdicaoId !== null;
  const endereco = estaEditando
    ? `/api/produtos/${produtoEmEdicaoId}`
    : '/api/produtos';

  const metodo = estaEditando ? 'PUT' : 'POST';

  mostrarMensagemFormulario('');
  botaoSalvar.disabled = true;
  botaoSalvar.textContent = 'Salvando...';

  try {
    const resposta = await fetch(endereco, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        descricao: campoDescricao.value.trim(),
        quantidade: Number(campoQuantidade.value),
        valor: Number(campoValor.value)
      })
    });

    if (resposta.status === 401) {
      encerrarSessao();
      return;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.mensagem || 'Nao foi possivel salvar o produto.'
      );
    }

    const mensagemSucesso = estaEditando
      ? 'Produto atualizado com sucesso.'
      : 'Produto cadastrado com sucesso.';

    fecharFormulario();
    await carregarProdutos();

    mensagemListagem.hidden = false;
    mensagemListagem.className =
      'mensagem-listagem mensagem-sucesso';
    mensagemListagem.textContent = mensagemSucesso;
  } catch (erro) {
    mostrarMensagemFormulario(erro.message, 'erro');
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = produtoEmEdicaoId !== null
      ? 'Salvar alterações'
      : 'Salvar produto';
  }
}

function abrirModalExclusao(produto, botaoExcluir) {
  produtoPendenteExclusao = produto;
  botaoExclusaoPendente = botaoExcluir;

  nomeProdutoExclusao.textContent = `"${produto.descricao}"`;
  mensagemExclusao.textContent = '';
  mensagemExclusao.hidden = true;

  modalExclusao.showModal();
  botaoCancelarExclusao.focus();
}

function fecharModalExclusao() {
  if (modalExclusao.open) {
    modalExclusao.close();
  }

  produtoPendenteExclusao = null;
  botaoExclusaoPendente = null;
  mensagemExclusao.textContent = '';
  mensagemExclusao.hidden = true;
}

async function confirmarExclusao() {
  if (!produtoPendenteExclusao || !botaoExclusaoPendente) {
    return;
  }

  const produto = produtoPendenteExclusao;
  const botaoExcluirTabela = botaoExclusaoPendente;

  botaoConfirmarExclusao.disabled = true;
  botaoConfirmarExclusao.textContent = 'Excluindo...';
  botaoCancelarExclusao.disabled = true;
  botaoExcluirTabela.disabled = true;

  try {
    const resposta = await fetch(`/api/produtos/${produto.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (resposta.status === 401) {
      encerrarSessao();
      return;
    }

    if (resposta.status !== 204) {
      let dados = {};

      try {
        dados = await resposta.json();
      } catch (erro) {
        dados = {};
      }

      throw new Error(
        dados.mensagem || 'Nao foi possivel excluir o produto.'
      );
    }

    if (produtoEmEdicaoId === produto.id) {
      fecharFormulario();
    }

    fecharModalExclusao();
    await carregarProdutos();

    mensagemListagem.hidden = false;
    mensagemListagem.className =
      'mensagem-listagem mensagem-sucesso';
    mensagemListagem.textContent = 'Produto excluido com sucesso.';
  } catch (erro) {
    mensagemExclusao.textContent = erro.message;
    mensagemExclusao.hidden = false;
    botaoExcluirTabela.disabled = false;
  } finally {
    botaoConfirmarExclusao.disabled = false;
    botaoConfirmarExclusao.textContent = 'Excluir produto';
    botaoCancelarExclusao.disabled = false;
  }
}

botaoNovoProduto.addEventListener('click', abrirFormularioCadastro);
botaoCancelar.addEventListener('click', fecharFormulario);
formularioProduto.addEventListener('submit', salvarProduto);
botaoSair.addEventListener('click', encerrarSessao);
botaoCancelarExclusao.addEventListener('click', fecharModalExclusao);
botaoConfirmarExclusao.addEventListener('click', confirmarExclusao);
modalExclusao.addEventListener('cancel', (evento) => {
  if (botaoConfirmarExclusao.disabled) {
    evento.preventDefault();
    return;
  }
  fecharModalExclusao();
});

if (!token) {
  encerrarSessao();
} else {
  mostrarNomeUsuario();
  carregarProdutos();
}