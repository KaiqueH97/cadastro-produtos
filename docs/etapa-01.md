# Etapa 1 — entender o servidor e fazer o primeiro commit

Objetivo: executar a aplicação, entender como uma requisição chega ao código e alterar a resposta antes de registrar a etapa no Git.

## O que acontece ao abrir o endereço

Ao abrir `http://localhost:3000`, o navegador envia uma requisição HTTP do tipo `GET` para o caminho `/`. O Express encontra a rota registrada em `aplicacao.js`, chama `apresentarSistema` e envia o JSON ao navegador.

Node.js executa JavaScript fora do navegador. Express é uma biblioteca que ajuda a receber requisições e definir qual função responde a cada endereço. npm instala dependências e executa os comandos definidos no `package.json`.

## Leia primeiro aplicacao.js

```js
const express = require('express');
```

`require` carrega um módulo. Aqui ele carrega a biblioteca Express instalada pelo npm. `const` cria um nome que não pode ser reatribuído; isso não torna todos os dados de um objeto imutáveis.

```js
const aplicacao = express();
```

Chama o Express para criar nossa aplicação. `aplicacao` é um nome nosso; poderia ser `app`, mas vamos favorecer nomes claros em português.

```js
function apresentarSistema(requisicao, resposta) {
  resposta.json({
    mensagem: 'Servidor do cadastro de produtos funcionando.'
  });
}
```

A função recebe dois objetos do Express: `requisicao` contém informações do pedido; `resposta` permite enviar o resultado. Ainda não precisamos ler a requisição. O método `json` transforma o objeto JavaScript em uma resposta JSON e a envia ao navegador.

```js
aplicacao.get('/', apresentarSistema);
```

Registra a função para pedidos `GET /`. Passamos `apresentarSistema` sem parênteses porque o Express deve chamá-la quando chegar um pedido. Com parênteses, tentaríamos executá-la imediatamente, durante a configuração.

```js
module.exports = aplicacao;
```

Disponibiliza a aplicação para outro arquivo carregá-la. Esse sistema de módulos se chama CommonJS e já era usado na primeira versão do projeto.

## Depois leia servidor.js

`require('./aplicacao')` carrega nosso arquivo local. O prefixo `./` significa “nesta mesma pasta”.

`porta = 3000` define em qual porta o servidor receberá conexões. A função `avisarInicio` escreve uma mensagem no terminal depois que o servidor começa a escutar. Os acentos graves da mensagem permitem inserir o valor de `${porta}` no texto.

`aplicacao.listen(porta, avisarInicio)` inicia a escuta. Deixar isso separado da configuração permitirá, mais adiante, testar a aplicação sem que importá-la abra automaticamente uma porta fixa.

## Relação com MVC

Esta primeira rota ainda não tem banco ou tela. A função `apresentarSistema` já realiza um trabalho típico de controlador: responder a um pedido HTTP.

Quando começarmos a listagem de produtos, vamos separar as responsabilidades:

| Conceito | Papel no projeto |
| --- | --- |
| Rota | Associa método e caminho HTTP a uma função. |
| Controlador | Lê o pedido e monta a resposta. |
| Modelo e acesso a dados | Representam os dados e consultam o MySQL; consultas ficarão no repositório. |
| Serviço | Agrupa regras do cadastro quando elas surgirem. |
| Visão | Tela feita em HTML, CSS e JavaScript, que busca dados na API. |

Serviço e repositório são divisões de responsabilidades; não representam camadas adicionais obrigatórias do MVC. Como a tela consumirá uma API JSON, o fluxo não é idêntico ao de um MVC que renderiza HTML no servidor.

## Experimente antes do commit

1. Execute a aplicação seguindo o README.
2. Troque a mensagem por `Minha primeira etapa esta funcionando.`.
3. Reinicie o servidor se estiver usando `npm start`; com `npm run dev`, ele reinicia ao salvar.
4. Atualize a página e veja a alteração.
5. Acesse `http://localhost:3000/produtos`. A resposta é 404 porque ainda não existe uma rota para esse caminho.

Para conferir sua compreensão: qual arquivo inicia a escuta? Qual linha escolhe a função que responde ao navegador? Por que a função é passada sem parênteses para `get`? Se alguma resposta não estiver clara, use-a como ponto de partida para a próxima explicação.

## Registrar a primeira etapa no Git

Estes comandos são para uma pasta nova. O ZIP contém os arquivos desta etapa e não inclui histórico Git. Se você já publicou a versão completa, mantenha aquele histórico e combine a integração antes de substituir arquivos.

Abra outro terminal na pasta `cadastro-produtos`, onde está o README. Se estiver dentro de `backend`, execute `cd ..`.

```bash
git init -b main
git status
git add .gitignore README.md docs/etapa-01.md backend/package.json backend/package-lock.json backend/src/aplicacao.js backend/src/servidor.js
git diff --cached
git commit -m "Inicia servidor e primeira rota do cadastro de produtos"
git log --oneline
```

`git add` seleciona o conteúdo que entrará no commit. `git diff --cached` mostra exatamente esse conteúdo. `git commit` registra a etapa localmente. O Git pode pedir que você configure seu nome e e-mail caso seja o primeiro commit na máquina; use sua própria identidade.

## Enviar ao GitHub

Commit salva o histórico local; `push` envia os commits para o repositório remoto. Ainda não há endereço de repositório configurado nesta entrega.

Se o destino for um repositório novo e vazio, substitua `URL_DO_SEU_REPOSITORIO` pelo endereço real:

```bash
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

Se o repositório já tiver arquivos ou commits, precisamos usar esse histórico como base. Não use envio forçado para contornar uma divergência.

Na próxima etapa, acrescentaremos somente o script SQL e sua explicação. A mensagem prevista é `Cria tabelas de usuarios e produtos`; o commit só será criado quando essa alteração existir.
