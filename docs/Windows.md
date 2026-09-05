## Instalação no Windows

Os comandos abaixo devem ser executados no PowerShell.

### 1. Instalar os pré-requisitos

Instale:

- Git
- Node.js 22 ou superior
- npm
- MySQL 8

Para o MySQL, pode ser utilizado o MySQL Installer para Windows. Durante a instalação, escolha uma opção que inclua o MySQL Server, como `Developer Default` ou `Server Only`.

Confirme as instalações:

```powershell
node --version
npm --version
git --version
mysql --version
```

Caso o comando `mysql` não seja reconhecido, utilize o MySQL Command Line Client ou adicione a pasta do MySQL ao `Path` do Windows.

Um caminho comum é:

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

### 2. Clonar o repositório

```powershell
git clone https://github.com/KaiqueH97/cadastro-produtos.git
Set-Location cadastro-produtos
```

### 3. Criar o banco e as tabelas

Na raiz do projeto:

```powershell
Get-Content .\backend\sql\criar-banco.sql |
  mysql -u root -p
```

Informe a senha do usuário `root` do MySQL.

Se o comando `mysql` não estiver no `Path`, utilize o caminho completo:

```powershell
Get-Content .\backend\sql\criar-banco.sql |
  & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### 4. Criar o usuário da aplicação

Entre no MySQL:

```powershell
mysql -u root -p
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

### 5. Instalar as dependências

```powershell
Set-Location backend
npm ci
```

### 6. Configurar o ambiente

```powershell
Copy-Item .env.example .env
notepad .env
```

Preencha o arquivo:

```env
PORTA=3000

BANCO_HOST=localhost
BANCO_PORTA=3306
BANCO_USUARIO=cadastro_app
BANCO_SENHA=coloque_a_senha_do_banco
BANCO_NOME=cadastro_produtos
JWT_SECRET=coloque_uma_chave_secreta
```

Uma chave JWT pode ser gerada com o próprio Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado para `JWT_SECRET`.

### 7. Iniciar o sistema

```powershell
npm start
```

Abra no navegador:

```text
http://localhost:3000
```

Para executar com reinicialização automática durante alterações:

```powershell
npm run dev
```