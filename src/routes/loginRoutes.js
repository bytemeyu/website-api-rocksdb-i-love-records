import express from 'express';
//importando o express, que é um módulo que facilita a criação de servidores HTTP.
import * as loginController from '../controllers/loginController.js';
//importando o módulo loginController, que contém funções que lidam com a lógica das rotas relacionadas ao login.

const router = express.Router();
//criando um objeto do tipo Router, que é um módulo do express que facilita a criação de rotas.

router.post('/login', loginController.loginUser);
//rota para autenticar o usuário e obter um token jwt, ou seja, tem que ser post, afinal, estamos enviando dados (usuário e senha).

router.get('/login', loginController.confirmLogin);
//rota que verifica se o usuário está logado. é um get, afinal, estamos apenas verificando se o usuário está logado (se tem token jwt válido), ou seja, não estamos enviando dados. e isso é feito da seguinte maneira: o cliente envia um cookie de sessão com o token jwt, e o servidor verifica se o token é válido (somente enviar um cookie de sessão não configura um método post (?)).

export default router;
//exportando o objeto router. isso permite que outros módulos importem e usem o objeto router. no caso, estamos exportando o objeto router para que o módulo app.js possa usar as rotas definidas neste módulo.