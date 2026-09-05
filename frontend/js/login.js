const formularioLogin = document.querySelector('#formulario-login');
const campoEmail = document.querySelector('#email');
const campoSenha = document.querySelector('#senha');
const botaoEntrar = document.querySelector('#botao-entrar');
const mensagemLogin = document.querySelector('#mensagem-login');

function mostrarMensagem(texto, tipo) {
  mensagemLogin.textContent = texto;
  mensagemLogin.className = `mensagem mensagem-${tipo}`;
}

const mensagemRecebida = sessionStorage.getItem('mensagemLogin');
const emailCadastrado = sessionStorage.getItem('emailCadastrado');

if (mensagemRecebida) {
  mostrarMensagem(mensagemRecebida, 'sucesso');
  sessionStorage.removeItem('mensagemLogin');
}

if (emailCadastrado) {
  campoEmail.value = emailCadastrado;
  campoSenha.focus();
  sessionStorage.removeItem('emailCadastrado');
}

formularioLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  mostrarMensagem('', '');
  botaoEntrar.disabled = true;
  botaoEntrar.textContent = 'Entrando...';

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: campoEmail.value,
        senha: campoSenha.value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.mensagem || 'Nao foi possivel entrar.');
    }

    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.usuario));

    window.location.href = '/produtos.html';
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  } finally {
    botaoEntrar.disabled = false;
    botaoEntrar.textContent = 'Entrar';
  }
});