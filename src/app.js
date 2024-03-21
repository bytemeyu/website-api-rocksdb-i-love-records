import express from 'express';
//importando o express, que é um módulo que facilita a criação de servidores HTTP.

import cors from 'cors';
//importando o módulo cors, que é um módulo que facilita a configuração de políticas de CORS, ou seja, políticas que definem quem pode acessar o servidor.

import cookieParser from 'cookie-parser';
//importando o módulo cookie-parser, que é um módulo que facilita a manipulação de cookies.

import userRoutes from './routes/userRoutes.js';
//importando o módulo userRoutes, que contém as rotas relacionadas aos usuários.

import loginRoutes from './routes/loginRoutes.js';
//importando o módulo loginRoutes, que contém as rotas relacionadas ao login.

import productRoutes from './routes/productRoutes.js';
//importando o módulo productRoutes, que contém as rotas relacionadas aos produtos.

import orderRoutes from './routes/orderRoutes.js';
//importando o módulo orderRoutes, que contém as rotas relacionadas aos pedidos.

import path from 'path'; 
//middleware para servir arquivos estáticos (como imagens, css, js, etc) a partir de um diretório específico.

import { fileURLToPath } from 'url';
//importando o módulo fileURLToPath do módulo url. esse módulo é usado para converter uma URL em um caminho de arquivo.

const app = express();
//criando um objeto do tipo express. esse objeto será o servidor HTTP.

app.use(cors());
//configurando o servidor para usar o módulo cors. isso permite que o servidor aceite requisições de outros domínios.

app.use(express.json());
//configurando o servidor para usar o módulo express.json. isso permite que o servidor entenda requisições que tenham corpo no formato json. funciona da seguinte maneira: quando o cliente envia uma requisição com corpo no formato json, o servidor entende o corpo da requisição e o transforma em um objeto JavaScript.

const __filename = fileURLToPath(import.meta.url);
//__filename é uma variável que contém o caminho do arquivo atual. estamos usando o módulo fileURLToPath para converter a URL de import.meta.url em um caminho de arquivo local. import.meta.url é um recurso do ESM que retorna a URL do módulo atual.

const __dirname = path.dirname(__filename);
//__dirname é uma variável que contém o diretório do arquivo atual. estamos usando o módulo path.dirname para obter o diretório do arquivo atual a partir de __filename.

app.use(express.static(path.join(__dirname, '..', 'public')));
//configurando o servidor para usar o módulo express.static. isso permite que o servidor sirva arquivos estáticos (como imagens, css, js, etc) a partir de um diretório específico. path.join(__dirname, '..', 'public') retorna o caminho absoluto para o diretório public. path.join() concatena segmentos de caminho. neste caso, ele está sendo usado para criar um caminho absoluto juntando o diretório de trabalho atual (obtido através de path.resolve()) com o diretório public.
//tive que fazer isso tudo pois estou usando ES Modules. optei por usa o ESM no projeto inteiro porque é mais moderno e mais fácil de usar.
//isso significa que, se você tiver um arquivo chamado index.html dentro de /public, ele poderá ser acessado diretamente através da raiz do seu domínio (no caso, http://localhost:3000/).

app.use(cookieParser());
//configurando o servidor para usar o módulo cookie-parser. isso permite que o servidor entenda e manipule cookies.

app.use('/api', userRoutes);
//configurando o servidor para usar as rotas definidas no módulo userRoutes. todas as rotas definidas no módulo userRoutes terão /api como prefixo na URL.

app.use('/api', loginRoutes);
//configurando o servidor para usar as rotas definidas no módulo loginRoutes. todas as rotas definidas no módulo loginRoutes terão /api como prefixo na URL.

app.use('/api/product', productRoutes);
//configurando o servidor para usar as rotas definidas no módulo productRoutes. todas as rotas definidas no módulo productRoutes terão /api/product como prefixo na URL.

app.use('/api/order', orderRoutes);
//configurando o servidor para usar as rotas definidas no módulo orderRoutes. todas as rotas definidas no módulo orderRoutes terão /api/order como prefixo na URL.

export default app;
//no caso, estamos exportando o objeto app para que o módulo server.js possa usar o objeto app.