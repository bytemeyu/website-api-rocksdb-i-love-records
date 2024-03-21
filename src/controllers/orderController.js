import { Database } from '../database/database.js';
//importando a classe Database do arquivo database.js. essa classe representa um banco de dados RocksDB.

import { db } from './productController.js';
//importando a constante db do arquivo productController.js. essa constante representa o banco de dados RocksDB de produtos. ela já foi inicializada e configurada no arquivo productController.js, portanto, não precisamos inicializá-la novamente.

const dbOrders = new Database('orders');
//new Database('orders') cria uma instância de Database com o nome 'orders'. 

export const createOrder = (req, res) => {
  const { items } = req.body;
  //{ items } terá as propriedades productId e quantity (?). ficará mais ou menos assim: { items: [{ productId: '1', quantity: 2 }, { productId: '2', quantity: 3 }] } (?).
  
  const checkProductsExist = (callback) => {
    //checkProductsExist é uma função que verifica se todos os produtos do pedido existem no banco de dados. ela recebe um callback como argumento, que será chamado quando a verificação for concluída. esse callback recebe um argumento: um booleano que indica se todos os produtos existem ou não.
    let count = items.length;
    //count é uma variável que contém o número de produtos do pedido. estamos inicializando count com o número de produtos do pedido.
    for (const item of items) {
      //o for...of é um loop que itera sobre os elementos de um array. no caso, estamos iterando sobre os produtos do pedido.
      db.get(item.productId, (err, productData) => {
        //get é um método da classe Database que lê um valor do banco de dados. ele recebe dois argumentos: a chave do valor que queremos ler e um callback que será chamado quando o valor correspondente for lido do banco de dados. no caso, estamos lendo o valor correspondente à chave item.productId, que é o id do produto do pedido.
        
        if (err || !productData) {
          callback(false);
          return;
        }

        count--;
        //decrementando count. estamos decrementando count toda vez que um produto é verificado.
        
        if (count === 0) {
          //se count for igual a 0, significa que todos os produtos foram verificados.
          callback(true);
        }
      });
    }
  };

  checkProductsExist((allExist) => {
    //checkProductsExist é uma função que verifica se todos os produtos do pedido existem no banco de dados. aqui estamos chamando essa função e passando um callback que será chamado quando a verificação for concluída.
    
    if (!allExist) {
      return res.status(404).send('um ou mais produtos do pedido não foram encontrados :O');
    }

    const id = Date.now().toString();
    //criando um id para o pedido. estamos usando Date.now().toString() para criar um id único baseado no tempo atual. isso só vai ser executado se a função não parar em if (!allExist), ou seja, se todos os produtos existirem.
    const newOrder = { id, items };
    //a estrutura de newOrder vai ficar mais ou menos assim: { id: '123456789', items: [{ productId: '1', quantity: 2 }, { productId: '2', quantity: 3 }] } (?).

    dbOrders.put(id, JSON.stringify(newOrder), (err) => {
      //dbOrders.put é um método da classe Database que escreve um valor no banco de dados. ela recebe três argumentos: a chave do valor que queremos escrever, o valor que queremos escrever e um callback que será chamado quando o valor for escrito no banco de dados.
      if (err) {
        return res.status(500).json({ success: false, message: "erro ao criar pedido :(" });
      }
      res.status(201).json(newOrder);
      //se não houver erro, retornamos newOrder, que é um objeto com os dados do pedido que acabamos de criar.
    });
  });
};

export const getOrders = (req, res) => {
  dbOrders.readAllData((err, data) => {
    //readAllData é um método da classe Database que lê todos os valores do banco de dados e retorna um array com todos os valores lidos. ele recebe como argumento um callback que será chamado quando todos os valores forem lidos do banco de dados. e esse callback recebe dois argumentos: um erro (err) e os valores lidos do banco de dados (data).
    if (err) {
      return res.status(500).json({ success: false, message: "erro ao buscar pedidos :(" });
    }
    res.status(200).json(data);
  });
};

export const getOrderById = (req, res) => {
  dbOrders.get(req.params.id, (err, orderData) => {
    //get é um método da classe Database que lê um valor do banco de dados. ele recebe dois argumentos: a chave do valor que queremos ler e um callback que será chamado quando o valor correspondente for lido do banco de dados. no caso, estamos lendo o valor correspondente à chave req.params.id, que é o id do pedido que queremos buscar.
    if (err || !orderData) {
      return res.status(404).send('pedido não encontrado :O');
    }
    const order = JSON.parse(orderData);
    res.status(200).json(order);
  });
};

export const updateOrder = (req, res) => {
  const { items } = req.body;
  //items é uma variável que contém os produtos do pedido que queremos atualizar. estamos acessando os produtos enviados no corpo da requisição HTTP pelo cliente através de req.body.items.
  const id = req.params.id;
  //id é uma variável que contém o id do pedido que queremos atualizar. estamos acessando o id enviado na URL da requisição HTTP através de req.params.id.

  dbOrders.get(id, (err, orderData) => {
    if (err || !orderData) {
      return res.status(404).send('pedido não encontrado :O');
    }

    const checkProductsExist = (callback) => {
      let count = items.length;
      for (const item of items) {
        db.get(item.productId, (err, productData) => {
          if (err || !productData) {
            callback(false);
            return;
          }
          count--;
          if (count === 0) {
            callback(true);
          }
        });
      }
    };  
    
    checkProductsExist((allExist) => {
      if (!allExist) {
        return res.status(404).send('um ou mais produtos do pedido não foram encontrados :O');
      }
      const updatedOrder = { items };
      dbOrders.put(id, JSON.stringify(updatedOrder), (err) => {
        if (err) {
          return res.status(500).send('erro ao atualizar pedido :(');
        }
        res.status(200).json(updatedOrder);
      });
    });
  });
};

export const deleteOrder = (req, res) => {
  dbOrders.del(req.params.id, (err) => {
    if (err) {
      return res.status(404).send('pedido não encontrado :O');
    }
    res.status(200).send('pedido deletado com sucesso!');
  });
};
