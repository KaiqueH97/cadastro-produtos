CREATE DATABASE IF NOT EXISTS cadastro_produtos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cadastro_produtos;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT unico_email_usuario UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT UNSIGNED NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  quantidade INT NOT NULL DEFAULT 0,
  valor DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT quantidade_produto_nao_negativa CHECK (quantidade >= 0),
  CONSTRAINT valor_produto_nao_negativo CHECK (valor >= 0),
  -- Preserva a identificacao do responsavel por produtos ja cadastrados.
  CONSTRAINT usuario_do_produto
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
) ENGINE=InnoDB;