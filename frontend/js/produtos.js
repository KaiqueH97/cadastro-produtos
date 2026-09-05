const token = localStorage.getItem('token');
const usuarioArmazenado = localStorage.getItem('usuario');

if (!token) {
  window.location.replace('/login.html');
} else {
  const nomeUsuario = document.querySelector('#nome-usuario');
  const botaoSair = document.querySelector('#botao-sair');

  try {
    const usuario = JSON.parse(usuarioArmazenado);

    nomeUsuario.textContent = `Olá, ${usuario.nome}`;
  } catch (erro) {
    nomeUsuario.textContent = 'Usuário autenticado';
  }

  botaoSair.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    window.location.replace('/login.html');
  });
}