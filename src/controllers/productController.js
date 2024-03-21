import { Database } from '../database/database.js';
//importando a classe Database do arquivo database.js. essa classe representa um banco de dados RocksDB.

export const db = new Database('products');
//new Database('products') cria uma instância de Database com o nome 'products'.

export const createProduct = (req, res) => {
  const { name, value, imgUrl } = req.body;
  //{ name, value, imgUrl } é um objeto que contém os dados do produto que queremos criar. req.body é um objeto que contém os dados enviados no corpo da requisição HTTP pelo cliente. como isso funciona: o cliente envia uma requisição HTTP com um corpo que contém os dados do produto que queremos criar. o servidor recebe essa requisição e usa o middleware body-parser para transformar o corpo da requisição em um objeto JavaScript que pode ser acessado através de req.body. então, podemos acessar os dados do produto que queremos criar através de req.body.name, req.body.value e req.body.imgUrl. agora name, value e imgUrl são variáveis que contêm os dados do produto que queremos criar.
  const id = Date.now().toString();
  //criando um id para o produto. estamos usando Date.now().toString() para criar um id único baseado no tempo atual. precisa do toString() pois RocksDB usa strings como chaves
  const newProduct = { id, name, value, imgUrl };
  //criando um objeto newProduct que contém os dados do produto que queremos criar.
  console.log(newProduct);

  db.put(id, JSON.stringify(newProduct), (err) => {
    //db.put é um método da classe Database que escreve um valor no banco de dados. ela recebe três argumentos: a chave do valor que queremos escrever, o valor que queremos escrever e um callback que será chamado quando o valor for escrito no banco de dados.
    if (err) {
      return res.status(500).json({ success: false, message: "erro ao criar produto :(" });
    } else {
      res.status(201).json({ success: true, message: "produto criado com sucesso :D" });
    }
  });
};

export const getProducts = (req, res) => {
  db.readAllData((err, data) => {
    //readAllData é um método da classe Database que lê todos os valores do banco de dados e retorna um array com todos os valores lidos. ele recebe como argumento um callback que será chamado quando todos os valores forem lidos do banco de dados. e esse callback recebe dois argumentos: um erro (err) e os valores lidos do banco de dados (data).
    if (err) {
      return res.status(500).json({ success: false, message: "erro ao buscar produtos :(" });
    }
    res.status(200).json(data);
    //se não houver erro, retornamos data, que é um array com todos os valores lidos do banco de dados.
  });
};

export const getProductById = (req, res) => {
  db.get(req.params.id, (err, productData) => {
    //get é um método da classe Database que lê um valor do banco de dados. ele recebe dois argumentos: a chave do valor que queremos ler e um callback que será chamado quando o valor correspondente for lido do banco de dados. no caso, estamos lendo o valor correspondente à chave req.params.id, que é o id do produto que queremos buscar
    if (err || !productData) {
      return res.status(404).send('produto não encontrado :O');
    }
    const product = JSON.parse(productData);
    //convertendo o valor lido do banco de dados para um objeto.
    res.status(200).json(product);
    //se não houver erro, retornamos o objeto convertido para o cliente.
  });
};

export const updateProduct = (req, res) => {
  const { name, value, imgUrl } = req.body;
  //name, value e imgUrl são variáveis que contêm os dados do produto que queremos atualizar. estamos acessando os dados enviados no corpo da requisição HTTP pelo cliente através de req.body.name, req.body.value e req.body.imgUrl.
  const id = req.params.id;
  //id é uma variável que contém o id do produto que queremos atualizar. estamos acessando o id enviado na URL da requisição HTTP através de req.params.id.

  db.get(id, (err, productData) => {
    if (err || !productData) {
      return res.status(404).send('produto não encontrado :O');
    }
    
    const updatedProduct = { name, value, imgUrl };
    //criando um objeto updatedProduct que contém os dados atualizados do produto.

    db.put(id, JSON.stringify(updatedProduct), (err) => {
      //db.put é um método da classe Database que escreve um valor no banco de dados. ela recebe três argumentos: a chave do valor que queremos escrever, o valor que queremos escrever e um callback que será chamado quando o valor for escrito no banco de dados.
      if (err) {
        return res.status(500).send('erro ao atualizar produto :(');
      }
      res.status(200).json({ success: true, message: "produto atualizado com sucesso :D"});
    });
  });
};

export const deleteProduct = (req, res) => {
  db.del(req.params.id, (err) => {
    if (err) {
      return res.status(404).send('produto não encontrado :O');
    }
    res.status(200).send('produto deletado com sucesso!');
  });
};
