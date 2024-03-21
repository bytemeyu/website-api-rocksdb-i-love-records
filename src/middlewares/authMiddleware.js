import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  //authMiddleware é um middleware que verifica se o token jwt é válido. se for, o usuário está logado. se não for, o usuário não está logado.
  const token = req.cookies.session_id;
  //estamos acessando o cookie de sessão que contém o token jwt através de req.cookies.session_id.
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //jwt.verify() verifica se o token jwt é válido. se for, retorna o payload do token (decoded). se não for, lança uma exceção. ele recebe dois argumentos - o token jwt e a chave secreta usada para assinar o token.
      req.user = decoded;
      //estamos adicionando o payload do token jwt (decoded) ao objeto req. dessa forma, podemos acessar o payload do token em outros middlewares ou controladores que são chamados após este middleware.
      
      next(); 
    } catch (error) {
      res.status(400).json({ error: 'token inválido :(' });
    }
  } else {
    res.status(401).json({ error: 'token não fornecido :(' });
  }
};

export const authRole = (permittedRoles) => {
  //authRole é um middleware que verifica se o usuário tem permissão para acessar uma rota.
  return (req, res, next) => {
    //return (req, res, next) => é uma função que retorna um middleware. isso é possível porque funções em JavaScript são de primeira classe, ou seja, podem ser passadas como argumentos e retornadas como valores (?). já vai direto pro return, pois é uma função que retorna outra função (?).
    const token = req.cookies.session_id;
    //estamos acessando o cookie de sessão que contém o token jwt através de req.cookies.session_id.

    if (!token) {
      return res.status(401).json({ error: 'token não fornecido :(' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //decoded passa a ser o payload do token jwt, ou seja, as informações do usuário que estão no token.
      req.user = decoded;

      if (!permittedRoles.includes(decoded.userType)) {
        //permittedRoles é um array que contém os tipos de usuário que têm permissão para acessar a rota. estamos verificando se o tipo de usuário do payload do token jwt (decoded.userType) está incluso no array permittedRoles.
        return res.status(403).json({ error: 'acesso negado. usuário não tem permissão' });
      }

      next();

    } catch (error) {
      res.status(400).json({ error: 'token inválido :(' });
    }
  };
};
