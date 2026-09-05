const token = localStorage.getItem('token');
const usuarioArmazenado = localStorage.getItem('usuario');

const nomeUsuario = document.querySelector('#nome-usuario');
const botaoSair = document.querySelector('#botao-sair');
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

function exibirProdutos(produtos) {
  corpoTabela.replaceChildren();

  if (produtos.length === 0) {
    containerTabela.hidden = true;
    mensagemListagem.hidden = false;
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
    mensagemListagem.textContent = erro.message;
    containerTabela.hidden = true;
  }
}

if (!token) {
  encerrarSessao();
} else {
  mostrarNomeUsuario();
  carregarProdutos();
}

botaoSair.addEventListener('click', encerrarSessao);