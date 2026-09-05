const formularioCadastro = document.querySelector(
  '#formulario-cadastro'
);
const campoNome = document.querySelector('#nome');
const campoEmail = document.querySelector('#email');
const campoSenha = document.querySelector('#senha');
const campoConfirmacaoSenha = document.querySelector(
  '#confirmacao-senha'
);
const botaoCadastrar = document.querySelector('#botao-cadastrar');
const mensagemCadastro = document.querySelector(
  '#mensagem-cadastro'
);

function mostrarMensagem(texto, tipo = '') {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.className = 'mensagem';

  if (tipo) {
    mensagemCadastro.classList.add(`mensagem-${tipo}`);
  }
}

formularioCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  mostrarMensagem('');

  if (campoSenha.value !== campoConfirmacaoSenha.value) {
    mostrarMensagem('As senhas informadas nao sao iguais.', 'erro');
    campoConfirmacaoSenha.focus();
    return;
  }

  botaoCadastrar.disabled = true;
  botaoCadastrar.textContent = 'Criando conta...';

  try {
    const resposta = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        senha: campoSenha.value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        dados.mensagem || 'Nao foi possivel criar a conta.'
      );
    }

    sessionStorage.setItem(
      'mensagemLogin',
      'Conta criada com sucesso. Agora faca seu login.'
    );

    sessionStorage.setItem('emailCadastrado', dados.email);

    window.location.href = '/login.html';
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  } finally {
    botaoCadastrar.disabled = false;
    botaoCadastrar.textContent = 'Criar conta';
  }
});