import express from 'express';

import * as productController from '../controllers/productController.js';

import { authMiddleware, authRole } from '../middlewares/authMiddleware.js';
//{ authMiddleware, authRole } é um objeto que contém duas funções: authMiddleware e authRole. authMiddleware é uma função que verifica se o token jwt é válido. authRole é uma função que verifica se o usuário tem permissão para acessar a rota.

const router = express.Router();

router.get('/', productController.getProducts);
//essa rota tá sozinha aqui, inclusive, antes do router.use(authMiddleware), pois eu quero que ela não precise de autenticação. qualquer pessoa pode acessar essa rota. isso é possível porque estamos definindo a rota antes de chamar o método router.use(authMiddleware). dessa forma, a função middleware authMiddleware não será executada para essa rota.

router.use(authMiddleware);
//router.use() é um método do objeto router que especifica uma função middleware que será executada para todas as rotas definidas abaixo.

router.post('/', authRole(['admin']), productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', authRole(['admin']), productController.updateProduct);
router.delete('/:id', authRole(['admin']), productController.deleteProduct);

export default router;