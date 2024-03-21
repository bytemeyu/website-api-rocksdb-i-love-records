import bcrypt from 'bcryptjs';
//importando o módulo bcryptjs, que nos permite criptografar senhas.

import { Database } from '../database/database.js';
//importando a classe Database do arquivo database.js. essa classe representa um banco de dados RocksDB.

export const db = new Database('users');
//new Database('users') cria uma instância de Database com o nome 'users'. o construtor de Database espera o nome do banco de dados como argumento.

//em todas essas funções abaixo eu vou usar a sintaxe de callback, afinal, em database.js, foi usada a sintaxe de callback para realizar operações de leitura e escrita no banco de dados (e não a sintaxe de async/await).
  
export const createUser = (req, res) => {
    const { username, name, password, userType } = req.body;
    //{ username, name, password, userType } é um objeto que contém os dados do usuário que queremos criar. req.body é um objeto que contém os dados enviados no corpo da requisição HTTP pelo cliente. como isso funciona: o cliente envia uma requisição HTTP com um corpo que contém os dados do usuário que queremos criar. o servidor recebe essa requisição e usa o middleware body-parser para transformar o corpo da requisição em um objeto JavaScript que pode ser acessado através de req.body. então, podemos acessar os dados do usuário que queremos criar através de req.body.username, req.body.name, req.body.password e req.body.userType. agora username, name, password e userType são variáveis que contêm os dados do usuário que queremos criar.

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        //bcrypt.hash é uma função que criptografa a senha do usuário. ela recebe três argumentos: a senha que queremos criptografar, o custo do algoritmo de criptografia e um callback que será chamado quando a senha for criptografada.
        if (err) {
            return res.status(500).json({ success: false, message: "erro ao criptografar senha :(" });
        }

        const newUser = { username, name, password: hashedPassword, userType };
        //criando um objeto newUser que contém os dados do usuário que queremos criar. estamos usando a variável hashedPassword, que contém a senha criptografada, em vez da variável password, que contém a senha em texto plano.
        console.log(newUser);

        db.put(username, JSON.stringify(newUser), (err) => {
            //db.put é um método da classe Database que escreve um valor no banco de dados. ela recebe três argumentos: a chave do valor que queremos escrever, o valor que queremos escrever e um callback que será chamado quando o valor for escrito no banco de dados.
            if (err) {
                res.status(500).json({ success: false, message: "erro ao criar usuário :(" });
            } else {
                res.status(201).json({ success: true, message: "usuário criado com sucesso :D" });
                //se não houver erro, o usuário é criado com sucesso.
            }
        });
    });
};

export const getUsers = (req, res) => {
    db.readAllData((err, data) => {
        //readAllData é um método da classe Database que lê todos os valores do banco de dados e retorna um array com todos os valores lidos. ele recebe como argumento um callback que será chamado quando todos os valores forem lidos do banco de dados. e esse callback recebe dois argumentos: um erro (err) e os valores lidos do banco de dados (data).
        if (err) {
            return res.status(500).json({ success: false, message: "erro ao buscar usuários :(" });
        }

        res.status(200).json(data);
        //se não houver erro, retornamos data, que é um array com todos os valores lidos do banco de dados.
    });
};


export const getUserByUsername = (req, res) => {
    const username = req.params.username;
    //req.params.username é um objeto que contém os parâmetros da URL da requisição HTTP. no caso, estamos acessando o parâmetro username, que é o nome de usuário do usuário que queremos buscar.
    console.log("buscando usuário:", username);

    db.get(username, (err, userData) => {
        //get é um método da classe Database que lê um valor do banco de dados. ele recebe dois argumentos: a chave do valor que queremos ler e um callback que será chamado quando o valor correspondente for lido do banco de dados. no caso, estamos lendo o valor correspondente à chave username, que é o nome de usuário do usuário que queremos buscar. esse callback recebe dois argumentos: um erro (err) e o valor lido do banco de dados (userData).
        if (err) {
            console.error(err);
            return res.status(404).send('usuário não encontrado :O');
        }

        try {
            //esse try é executado se não houver erros ao ler o valor do banco de dados.
            const user = JSON.parse(userData);
            //aqui, estamos convertendo o valor lido do banco de dados para um objeto.
            res.status(200).json(user);
            //aqui, estamos retornando o objeto convertido para o cliente.
        } catch (parseError) {
            console.error(parseError);
            //esse catch é executado se houver erros ao converter o valor lido do banco de dados para um objeto. parseError é uma instância de Error que contém informações sobre o erro.
            res.status(500).send('erro ao processar os dados do usuário.');
        }
    });
};


export const updateUser = (req, res) => {
    const usernameRequired = req.params.username;
    const { username, name, password, userType } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        //aqui ele já criptografa a senha nova fornecida, antes mesmo de verificar se o usuário existe. isso é um problema, pois se o usuário não existir, ele criptografará a senha nova e não fará nada com ela. [depois mudar isso!]
        if (err) {
            return res.status(500).json({ success: false, message: "erro ao criptografar senha :(" });
        }

        db.get(usernameRequired, (err, userData) => {
            //no caso, estamos lendo o valor correspondente à chave usernameRequired, que é o nome de usuário do usuário que queremos atualizar. coloquei usernameRequired e não username, pois se eu nomeasse ambas as variáveis como username daria conflito. chamamos usernameRequired, pois a chave do usuário que queremos atualizar é o username que foi fornecido na URL da requisição HTTP, ou seja, o usernameRequired. [depois ver como resolver isso]
            if (err || !userData) {
                return res.status(404).send("usuário não encontrado :(");
            }

            const updatedUser = { username, name, password: hashedPassword, userType };
            console.log(updatedUser);

            db.put(usernameRequired, JSON.stringify(updatedUser), (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: "erro ao atualizar usuário :(" });
                } else {
                    res.status(200).json({ success: true, message: "usuário atualizado com sucesso :(" });
                }
            });
        });
    });
};

export const deleteUser = (req, res) => {
    const username = req.params.username;
    //aqui pode dar um problema caso eu tenha atualizado o username, pois a chave do usuário no banco de dados é o username antigo. [depois ver como resolver isso]
    db.del(username, (err) => {
        if (err) {
            res.status(404).send("usuário não encontrado :(");
        } else {
            res.status(200).send("usuário deletado com sucesso :(");
        }
    });
};
