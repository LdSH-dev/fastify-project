# fastify-project

# Projeto

Este é um projeto que utiliza Docker para facilitar o desenvolvimento e a execução.

## Como rodar o projeto

1. Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina.
2. Na raiz do projeto, execute o seguinte comando para construir e iniciar os containers:

```
docker-compose up --build
```

3. Após a construção dos containers, rode o seguinte comando
   
```
RUN npx sequelize init
RUN npx sequelize-cli db:migrate
```

4. Após isso, acesse o projeto no navegador através do seguinte endereço:
   http://localhost:8080
