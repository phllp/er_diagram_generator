# Project Setup

O app consiste em um frontend desenvolvido com JS vanilla e um backend implementado utilizando Node e Express.

# Backend

Estando na pasta raíz do projeto:

```
cd backend
npm i -- ou qualquer gerenciador de pacotes
node index.js
```

A porta configurada para o servidor é a `3000`

# Frontend

Existem várias formas de subir esse código localmente, aqui está um exemplo usando o live-server. Certifique-se que ele está instalado na sua máquina, se não estiver é possível instalar com `npm install -g live-server`

```
cd mermaid
live-server
```

# Banco de Dados

Atravéz da interface do app é possível conectar com qualquer banco de dados postgres que esteja rodando localmente, como conveniência há um arquivo docker compose que sobe duas instâncias de banco de dados postgres na raíz do projeto. Para utilizar é necessário somente rodar um `docker compose up`.

As configurações padrão de conexão como HOST, PORT, USERNAME e PASSWORD podem ser alteradas diretamente no arquivo `docker-compose.yml`
