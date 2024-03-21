import express from 'express';

import * as orderController from '../controllers/orderController.js';

import { authMiddleware, authRole } from '../middlewares/authMiddleware.js';
//{ authMiddleware, authRole } é um objeto que contém duas funções: authMiddleware e authRole. authMiddleware é uma função que verifica se o token jwt é válido. authRole é uma função que verifica se o usuário tem permissão para acessar a rota.

const router = express.Router();

router.use(authMiddleware);
//router.use() é um método do objeto router que especifica uma função middleware que será executada para todas as rotas definidas no objeto router. no caso, estamos especificando que a função middleware authMiddleware será executada para todas as rotas definidas neste módulo (abaixo).

router.post('/', orderController.createOrder); 
router.get('/', authRole(['admin']), orderController.getOrders);
router.get('/:id', authRole(['admin']), orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', authRole(['admin']), orderController.deleteOrder);

export default router;