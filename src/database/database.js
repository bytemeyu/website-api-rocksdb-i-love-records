import RocksDB from 'rocksdb';
//importando o módulo RocksDB, que nos permite criar e manipular bancos de dados RocksDB.
import path from 'path';
//importando o módulo path, que nos permite manipular caminhos de arquivos e diretórios.
import { fileURLToPath } from 'url';
//importando a função fileURLToPath do módulo url, que nos permite converter um URL para um caminho de arquivo.

const __filename = fileURLToPath(import.meta.url);
//a função fileURLToPath é usada para converter a URL do módulo em que estaremos (o módulo em que o código vai ser executado, ou seja, o módulo onde a classe Database vai ser importada, instanciada e usada) para um caminho de arquivo. import.meta.url é uma propriedade especial que contém a URL do módulo em que o código está sendo executado.
const __dirname = path.dirname(__filename);
//o método path.dirname é usado para obter o diretório onde o módulo está sendo executado. ele basicamente consegue descobrir o diretório a partir do caminho do arquivo.

export class Database {
    constructor(dbName) {
        this.dbPath = path.resolve(__dirname, '../../db_data', dbName);
        //path.resolve(__dirname, '../../db_data', dbName) é o caminho onde o banco de dados será criado ou aberto. estamos usando o método path.resolve para criar o caminho absoluto, pois o construtor de RocksDB espera um caminho absoluto. o primeiro argumento de path.resolve é __dirname, que é o diretório onde o módulo está sendo executado. o segundo argumento é '../../db_data', que é o diretório onde os bancos de dados serão armazenados. o terceiro argumento é dbName, que é o nome do banco de dados.

        this.db = null;
        //estamos inicializando o atributo db com null, ou seja, o banco de dados ainda não foi aberto. isso serve para que possamos verificar se o banco de dados já foi aberto ou não. 

        this.open((err) => {
            //esse argumento é uma função que será executada quando o banco de dados for aberto. se houver um erro, err será uma instância de Error, caso contrário, err será undefined.
            if (err) {
                console.error(`erro ao abrir o banco de dados ${dbName}:`, err);
            } else {
                console.log(`banco de dados ${dbName} aberto com sucesso :D`);
            }
        });
        //esse método open é chamado no construtor da classe Database, ou seja, sempre que uma instância de Database for criada, o banco de dados será aberto.
    }

    open(callback) {
        this.db = new RocksDB(this.dbPath);
        //estamos criando uma instância de RocksDB, que representa o banco de dados RocksDB. o construtor de RocksDB recebe como argumento o caminho onde o banco de dados será criado ou aberto.
        this.db.open(callback);
        //estamos abrindo o banco de dados. o método open recebe um callback como argumento, que será chamado quando o banco de dados for aberto.
    }
    //esse open(callback) será chamado quando o banco de dados já tiver sido criado, ou seja, quando o banco de dados já existir e nós só precisarmos abri-lo.

    close(callback) {
        if (this.db) {
            this.db.close(callback);
        }
    }
    //esse close(callback) será chamado quando precisarmos fechar o banco de dados. o método close recebe um callback como argumento, que será chamado quando o banco de dados for fechado.

    put(key, value, callback) {
        if (!this.db) {
            return callback(new Error('banco de dados não está aberto :('));
        }

        this.db.put(key, value, callback);
    }
    //o método put recebe a chave (key) e o valor (value) como argumentos e um callback que será chamado quando a operação de escrita no banco de dados for concluída.

    readAllData(callback) {
        if(!this.db) {
            return callback(new Error('banco de dados não está aberto :('));
        }

        const data = [];
        //aqui, estamos criando um array vazio para armazenar os dados lidos do banco de dados.

        const iterator = this.db.iterator({});
        //aqui, estamos criando um iterador para iterar sobre todos os pares chave-valor do banco de dados. o método iterator retorna um iterador que nos permite iterar sobre todos os pares chave-valor do banco de dados. o método iterator recebe um objeto como argumento, que pode conter opções para o iterador. no caso, estamos passando um objeto vazio, pois não precisamos de nenhuma opção.
    
        const loop = () => {
            //o loop chama um por um os pares chave-valor do banco de dados, até que não haja mais pares chave-valor para ler.
            iterator.next((err, key, value) => {
                //o iterator.next funciona da seguinte maneira: ele recebe um callback como argumento, que será chamado quando o próximo par chave-valor for lido do banco de dados. o callback recebe três argumentos: um erro (err), a chave (key) e o valor (value).
                if (err) {
                    //se houver um erro, err será uma instância de Error, então chamamos o callback com o erro.
                    iterator.end(() => {
                        callback(err);
                    });
                    return;
                }

                if (!key && !value) {
                    //se key e value forem undefined, isso significa que não há mais pares chave-valor para ler, então chamamos o callback com os dados lidos.
                    iterator.end(() => {
                        //o método end encerra o iterador
                        callback(null, data);
                        //estamos chamando o callback com os dados lidos do banco de dados. null é passado como primeiro argumento, pois não houve erro. data é passado como segundo argumento, pois são os dados lidos do banco de dados.
                    });
                    return;
                }

                data.push({ key: key.toString(), value: value.toString() });
                //aqui, estamos adicionando o par chave-valor ao array data. como key e value são buffers (afinal, o banco de dados RocksDB armazena dados como buffers - arrays de bytes), precisamos convertê-los para strings com o método toString, para que possamos manipulá-los mais facilmente.
                loop();
                //aqui, estamos chamando o loop novamente, para que o próximo par chave-valor seja lido do banco de dados.
            });
        }

        loop();
        //aqui, estamos chamando o loop pela primeira vez, para que o primeiro par chave-valor seja lido do banco de dados.
    }

    get(key, callback) {
        if (!this.db) {
            return callback(new Error('banco de dados não está aberto :('));
        }

        this.db.get(key, callback);
        //o método get recebe a chave (key) como argumento e um callback que será chamado quando a operação de leitura no banco de dados for concluída.
    }

    del(key, callback) {
        if (!this.db) {
            return callback(new Error('banco de dados não está aberto :('));
        }

        this.db.del(key, callback);
        //o método del recebe a chave (key) como argumento e um callback que será chamado quando a operação de remoção no banco de dados for concluída.
    }
}