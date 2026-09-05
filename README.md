# Cadastro de Produtos

Sistema web para cadastro e gerenciamento de produtos, desenvolvido como teste prático para uma vaga de estágio em desenvolvimento web.

O projeto possui front-end em HTML, CSS e JavaScript puro, API em Node.js com Express e persistência em banco de dados MySQL.

## Funcionalidades

- Cadastro de usuários
- Login com autenticação JWT
- Senhas protegidas com bcrypt
- Cadastro de produtos
- Listagem de todos os produtos
- Busca de produto por ID
- Edição de produtos
- Exclusão com confirmação
- Identificação automática do usuário que cadastrou o produto
- Filtros por descrição, usuário e faixa de valor
- Ordenação crescente e decrescente
- Interface responsiva
- Validação de dados no front-end e no back-end

O catálogo é compartilhado: usuários autenticados visualizam os produtos cadastrados no sistema, junto com o nome de quem realizou cada cadastro.

## Tecnologias

### Back-end

- Node.js
- Express
- MySQL
- mysql2
- bcrypt
- JSON Web Token
- dotenv

### Front-end

- HTML
- CSS
- JavaScript
- Fetch API
- Local Storage

## Organização

O back-end foi separado por responsabilidades:

```text
Rota
  ↓
Controlador
  ↓
Repositório
  ↓
MySQL
```

```text
cadastro-produtos/
├── backend/
│   ├── sql/
│   │   └── criar-banco.sql
│   ├── src/
│   │   ├── configuracao/
│   │   ├── controladores/
│   │   ├── intermediarios/
│   │   ├── repositorios/
│   │   ├── rotas/
│   │   ├── aplicacao.js
│   │   └── servidor.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── css/
│   ├── js/
│   ├── cadastro.html
│   ├── login.html
│   └── produtos.html
├── docs/
├── .gitignore
└── README.md
```

## Pré-requisitos

O projeto foi desenvolvido e testado com:

- Linux Mint/Ubuntu
- Node.js 22 ou superior
- npm
- MySQL 8
- Git

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/KaiqueH97/cadastro-produtos.git
cd cadastro-produtos
```

### 2. Criar o banco e as tabelas

Com o MySQL instalado:

```bash
sudo mysql -u root < backend/sql/criar-banco.sql
```

O script cria o banco `cadastro_produtos` e as tabelas `usuarios` e `produtos`.

### 3. Criar o usuário da aplicação

Entre no MySQL:

```bash
sudo mysql -u root
```

Em uma instalação nova, execute:

```sql
CREATE USER 'cadastro_app'@'localhost'
IDENTIFIED BY 'coloque_uma_senha_segura';

GRANT SELECT, INSERT, UPDATE, DELETE
ON cadastro_produtos.*
TO 'cadastro_app'@'localhost';

EXIT;
```

A senha informada deverá ser colocada posteriormente no arquivo `.env`.

### 4. Instalar as dependências

```bash
cd backend
npm ci
```

### 5. Configurar o ambiente

Ainda dentro de `backend`:

```bash
cp .env.example .env
nano .env
```

Preencha:

```env
PORTA=3000

BANCO_HOST=localhost
BANCO_PORTA=3306
BANCO_USUARIO=cadastro_app
BANCO_SENHA=coloque_a_senha_do_banco
BANCO_NOME=cadastro_produtos
JWT_SECRET=coloque_uma_chave_secreta
```

No Linux, uma chave JWT pode ser gerada com:

```bash
openssl rand -hex 32
```

O arquivo `.env` contém informações sensíveis e não deve ser enviado ao GitHub.

### 6. Iniciar o sistema

```bash
npm start
```

Abra no navegador:

```text
http://localhost:3000
```

No desenvolvimento, também é possível utilizar:

```bash
npm run dev
```

## Uso inicial

Como o banco começa sem usuários:

1. abra o sistema;
2. clique em **Cadastre-se**;
3. crie uma conta;
4. faça login;
5. utilize a tela de produtos.

## Endpoints

As rotas de produtos exigem o cabeçalho:

```http
Authorization: Bearer TOKEN
```

| Método | Endpoint | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/api/usuarios` | Não | Cadastra um usuário |
| POST | `/api/login` | Não | Realiza login |
| GET | `/api/produtos` | Sim | Lista produtos |
| GET | `/api/produtos/:id` | Sim | Busca por ID |
| POST | `/api/produtos` | Sim | Cadastra produto |
| PUT | `/api/produtos/:id` | Sim | Atualiza produto |
| DELETE | `/api/produtos/:id` | Sim | Exclui produto |

### Filtros e ordenação

Exemplo:

```http
GET /api/produtos?descricao=mouse&valor_minimo=50&ordenar_por=valor&direcao=asc
```

Parâmetros disponíveis:

| Parâmetro | Descrição |
| --- | --- |
| `descricao` | Filtra pela descrição |
| `usuario` | Filtra pelo nome do usuário |
| `valor_minimo` | Define o valor mínimo |
| `valor_maximo` | Define o valor máximo |
| `ordenar_por` | `id`, `data_cadastro`, `usuario` ou `valor` |
| `direcao` | `asc` ou `desc` |

## Segurança

- Senhas armazenadas como hash bcrypt
- Autenticação por JWT com expiração
- Consultas SQL parametrizadas
- Validação dos dados recebidos
- Lista permitida para colunas de ordenação
- Credenciais armazenadas fora do Git
- Identificação do criador pelo token, não pelo corpo da requisição

## Scripts

Dentro de `backend`:

```bash
npm start
```

Inicia o servidor.

```bash
npm run dev
```

Inicia o servidor com reinicialização automática.

## Uso de inteligência artificial

A inteligência artificial foi utilizada como ferramenta de apoio para planejamento, explicação de conceitos e revisão durante o desenvolvimento.

O projeto foi construído e validado em etapas, com commits incrementais, testes manuais das rotas e acompanhamento do fluxo entre front-end, API e banco de dados.

## Melhorias futuras

- Testes automatizados
- Controle de permissões por perfil
- Paginação da listagem
- Recuperação de senha
- Deploy da aplicação