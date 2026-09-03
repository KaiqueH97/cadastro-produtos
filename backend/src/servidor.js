require('dotenv').config({ quiet: true });

const aplicacao = require('./aplicacao');
const banco = require('./configuracao/conexao-banco');

const porta = Number(process.env.PORTA || 3000);

async function iniciarServidor() {
  try {
    await banco.query('SELECT 1');

    aplicacao.listen(porta, () => {
      console.log('Conexao com o MySQL estabelecida.');
      console.log(`Servidor disponivel em http://localhost:${porta}`);
    });
  } catch (erro) {
    console.error('Nao foi possivel conectar ao MySQL:', erro.message);
    process.exit(1);
  }
}

iniciarServidor();