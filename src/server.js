import dotenv from 'dotenv';
//para importar o dotenv
//para usar o config do dotenv, é necessário chamar o método config() do objeto dotenv. o método config() carrega as variáveis de ambiente do arquivo .env para o process.env.

dotenv.config();
//chamando o método config() do objeto dotenv, ou seja, carregando as variáveis de ambiente do arquivo .env para o process.env.

//para garantir que as variáveis de ambiente estejam disponíveis para todo o meu aplicativo desde o início, é necessário importar o dotenv e chamar o método config() no início do arquivo server.js (antes de importar quaisquer outros módulos).

//console.log(process.env.JWT_SECRET); //só para testar se o dotenv está funcionando

import app from './app.js';
//importando o objeto app do módulo app.js. o objeto app é o servidor HTTP.

const port = process.env.PORT || 3000;
//declarando a constante que vai definir a porta que o servidor irá escutar. neste caso, ao invés de só 3000, colocamos o 'process.env.PORT'. isso tudo significa "Defina port como o valor da variável de ambiente PORT se ela estiver definida e tiver um valor verdadeiro; caso contrário, use 3000 como o valor padrão.". o uso de process.env.PORT permite que o número da porta seja configurado externamente, o que é uma prática comum em ambientes de hospedagem ou deploy, como AWS ou outros.

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port} AAAAA`);
});
//o código acima inicia o servidor HTTP. o método 'app.listen()' vincula e escuta conexões na porta definida. a função de callback é executada assim que o servidor começa a escutar, imprimindo uma mensagem no console informando que o servidor está em execução e a porta na qual está escutando.