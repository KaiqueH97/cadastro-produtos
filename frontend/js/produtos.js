const token = localStorage.getItem('token');
const usuarioArmazenado = localStorage.getItem('usuario');

const nomeUsuario = document.querySelector('#nome-usuario');
const botaoSair = document.querySelector('#botao-sair');
const botaoNovoProduto = document.querySelector('#botao-novo-produto');
const formularioProduto = document.querySelector('#formulario-produto');
const campoDescricao = document.querySelector('#descricao');
const campoQuantidade = document.querySelector('#quantidade');
const campoValor = document.querySelector('#valor');
const botaoCancelar = document.querySelector('#botao-cancelar');
const botaoSalvar = document.querySelector('#botao-salvar');
const mensagemFormulario = document.querySelector('#mensagem-formulario');
const mensagemListagem = document.querySelector('#mensagem-listagem');
const containerTabela = document.querySelector('#container-tabela');
const corpoTabela = document.querySelector('#corpo-tabela-produtos');

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

function mostrarMensagemFormulario(texto, tipo = '') {
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = 'mensagem';

  if (tipo) {
    mensagemFormulario.classList.add(`mensagem-${tipo}`);
  }

  mensagemFormulario.hidden = texto.length === 0;
}

function abrirFormulario() {
  formularioProduto.hidden = false;
  mostrarMensagemFormulario('');
  campoDescricao.focus();
}

function fecharFormulario() {
  formularioProduto.reset();
  formularioProduto.hidden = true;
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
      criarCelula(formatarValor(produto.valor), 'celula-valor')
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

async function cadastrarProduto(evento) {
  evento.preventDefault();

  mostrarMensagemFormulario('');
  botaoSalvar.disabled = true;
  botaoSalvar.textContent = 'Salvando...';

  try {
    const resposta = await fetch('/api/produtos', {
      method: 'POST',
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
        dados.mensagem || 'Nao foi possivel cadastrar o produto.'
      );
    }

    fecharFormulario();
    await carregarProdutos();

    mensagemListagem.hidden = false;
    mensagemListagem.className =
      'mensagem-listagem mensagem-sucesso';
    mensagemListagem.textContent = 'Produto cadastrado com sucesso.';
  } catch (erro) {
    mostrarMensagemFormulario(erro.message, 'erro');
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = 'Salvar produto';
  }
}

botaoNovoProduto.addEventListener('click', abrirFormulario);
botaoCancelar.addEventListener('click', fecharFormulario);
formularioProduto.addEventListener('submit', cadastrarProduto);
botaoSair.addEventListener('click', encerrarSessao);

if (!token) {
  encerrarSessao();
} else {
  mostrarNomeUsuario();
  carregarProdutos();
}