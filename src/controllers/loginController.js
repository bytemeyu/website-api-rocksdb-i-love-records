import bcrypt from 'bcryptjs';
//importando o módulo bcryptjs, que nos permite criptografar senhas.

import jwt from 'jsonwebtoken';
//importando o módulo jsonwebtoken, que nos permite criar e verificar tokens de autenticação.

import { db } from './userController.js';
//importando a constante db do arquivo userController.js. essa constante representa o banco de dados RocksDB de usuários. ela já foi inicializada e configurada no arquivo userController.js, portanto, não precisamos inicializá-la novamente.

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  db.get(username, (err, userData) => {
    //get é um método da classe Database que lê um valor do banco de dados. ele recebe dois argumentos: a chave do valor que queremos ler e um callback que será chamado quando o valor correspondente for lido do banco de dados. no caso, estamos lendo o valor correspondente à chave username, que é o nome de usuário do usuário que queremos buscar. esse callback recebe dois argumentos: um erro (err) e o valor lido do banco de dados (userData).
    if (err || !userData) {
      return res.status(401).json({ error: "usuário inválido :(" });
    }

    const user = JSON.parse(userData);
    //convertendo o valor lido do banco de dados para um objeto.

    bcrypt.compare(password, user.password, (err, passwordIsValid) => {
      //compare é um método do módulo bcryptjs que compara uma senha em texto plano com uma senha criptografada. ele recebe três argumentos: a senha em texto plano (password), a senha criptografada (user.password) e um callback que será chamado quando a comparação for concluída. 
      if (err || !passwordIsValid) {
        return res.status(401).json({ error: "senha inválida :(" });
      }

      const token = jwt.sign(
        //sign é um método do módulo jsonwebtoken que cria um token de autenticação. ele recebe três argumentos: o payload do token (no caso, um objeto com o nome de usuário e o tipo de usuário), a chave secreta usada para assinar o token e um objeto com opções (no caso, o tempo de expiração do token).
        { username, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('session_id', token, { httpOnly: true, maxAge: 3600000 });
      //res.cookie é um método do objeto res que define um cookie na resposta HTTP. ele recebe três argumentos: o nome do cookie, o valor do cookie e um objeto com opções (no caso, httpOnly: true para que o cookie só possa ser acessado por HTTP e maxAge: 3600000 para que o cookie expire em 1 hora).
      res.status(200).json({ success: true, message: "logado com sucesso :D" });
      //se não houver erro, o usuário é logado com sucesso.
    });
  });
};

export const confirmLogin = (req, res) => {
  const token = req.cookies.session_id;
  //req.cookies é um objeto que contém os cookies da requisição HTTP. no caso, estamos acessando o cookie session_id, que é o token de autenticação do usuário.

  if (!token) {
    return res.status(401).json({ error: 'token não fornecido :(' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //verify é um método do módulo jsonwebtoken que verifica a validade de um token de autenticação. ele recebe dois argumentos: o token de autenticação e a chave secreta usada para assinar o token. se o token for válido, verify retorna o payload do token (no caso, um objeto com o nome de usuário e o tipo de usuário).
    db.get(decoded.username, (err, userData) => {
      //get é um método da classe Database que lê um valor do banco de dados. ele recebe dois argumentos: a chave do valor que queremos ler e um callback que será chamado quando o valor correspondente for lido do banco de dados. no caso, estamos lendo o valor correspondente à chave decoded.username, que é o nome de usuário do usuário que queremos buscar. esse callback recebe dois argumentos: um erro (err) e o valor lido do banco de dados (userData).
      if (err || !userData) {
        return res.status(401).json({ error: 'falha na autenticação :(' });
      }

      const foundUser = JSON.parse(userData);
      //convertendo o valor lido do banco de dados para um objeto.

      if (foundUser) {
        return res.status(200).json({ username: foundUser.username, name: foundUser.name });
        //se o usuário for encontrado, retornamos um objeto com o nome de usuário e o nome do usuário.
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'falha na autenticação :(' });
  }
};
