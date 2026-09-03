# Cadastro de produtos

Projeto para o teste de estágio em desenvolvimento web. A implementação está sendo construída em etapas com JavaScript, Node.js e Express. As próximas etapas acrescentarão MySQL e a interface em HTML, CSS e JavaScript.

## Estado atual — etapa 1

Servidor HTTP com uma rota `GET /` que responde em JSON. Esta etapa estabelece a base de execução; o CRUD, o banco e o login ainda serão implementados.

## Executar

Pré-requisitos: Node.js 22 ou superior e npm. Git será usado para registrar as etapas.

No terminal, dentro de `cadastro-produtos`:

```bash
cd backend
npm ci
npm start
```

Abra http://localhost:3000 no navegador. A resposta esperada é:

```json
{
  "mensagem": "Servidor do cadastro de produtos funcionando."
}
```

Para interromper o servidor, pressione `Ctrl+C` no terminal. Durante alterações, use `npm run dev` para reiniciar automaticamente quando salvar arquivos JavaScript.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `backend/package.json` | Nome do projeto, comandos de execução e dependências. |
| `backend/package-lock.json` | Versões exatas das dependências instaladas. Deve entrar no Git. |
| `backend/src/aplicacao.js` | Criação da aplicação e configuração da rota. |
| `backend/src/servidor.js` | Inicialização do servidor na porta 3000. |
| `.gitignore` | Define arquivos que ficam fora do controle de versão. |
| `docs/etapa-01.md` | Explicação do código, exercício e comandos para o primeiro commit. |

## Próximas etapas

1. Servidor e primeira rota — implementação atual.
2. Script de criação das tabelas `usuarios` e `produtos` no MySQL.
3. Conexão com o banco e listagem de produtos, separando rota, controlador e acesso aos dados.
4. Busca por ID e cadastro, com validações.
5. Edição e exclusão por ID.
6. Interface com tabela e formulário.
7. Login e associação do usuário autenticado ao produto.
8. Filtros, ordenação e revisão da entrega.

As regras de negócio ganharão um arquivo de serviço quando houver validações a organizar. Diferenciais como CRUD de usuários, JWT e testes serão avaliados depois que o fluxo principal estiver compreendido e funcionando.

Nomes de arquivos, funções, variáveis e campos criados pelo projeto serão escritos em português, sem acentos nos identificadores. Palavras da linguagem e APIs de bibliotecas, como `const`, `require`, `get` e `listen`, mantêm seus nomes originais.

## Desenvolvimento e uso de IA

Esta base inicial foi gerada com auxílio de IA. A construção acompanhada inclui leitura dos arquivos, execução e alterações práticas pelo candidato. O histórico deve registrar as mudanças realizadas conforme as etapas avançarem. A documentação será atualizada para descrever o que foi efetivamente implementado e validado.

Referência: [primeira aplicação com Express](https://expressjs.com/en/starter/hello-world/).
