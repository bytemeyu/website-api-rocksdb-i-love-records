import express from 'express';
//importando o express, que é um módulo que facilita a criação de servidores HTTP.
import { createUser, getUsers, getUserByUsername, updateUser, deleteUser } from '../controllers/userController.js';
//importando as funções que lidam com a lógica das rotas relacionadas aos usuários.

const router = express.Router();
//criando um objeto do tipo Router, que é um módulo do express que facilita a criação de rotas.

router.post('/user', createUser);
//rota para criar um usuário. é um post, afinal, estamos enviando dados (username, name, password e userType).

router.get('/user', getUsers);
//rota para listar todos os usuários. é um get, afinal, estamos lendo dados.

router.get('/user/:username', getUserByUsername);
//rota para ler um usuário específico. é um get, afinal, estamos lendo dados. o username do usuário que queremos ler é passado como parâmetro na URL.

router.put('/user/:username', updateUser);
//rota para atualizar um usuário. é um put, afinal, estamos atualizando dados. o username do usuário que queremos atualizar é passado como parâmetro na URL.

router.delete('/user/:username', deleteUser);
//rota para deletar um usuário. é um delete, afinal, estamos deletando dados. o username do usuário que queremos deletar é passado como parâmetro na URL.

export default router;
//exportando o objeto router. isso permite que outros módulos importem e usem o objeto router. no caso, estamos exportando o objeto router para que o módulo app.js possa usar as rotas definidas neste módulo.