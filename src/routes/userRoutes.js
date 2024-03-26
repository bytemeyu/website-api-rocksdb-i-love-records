import express from 'express';
//express also allows us to create routes. we are importing the express module to create the routes related to users.

import { createUser, getUsers, getUserByUsername, updateUser, deleteUser } from '../controllers/userController.js';
//importing the functions that deal with the logic of the routes related to users.



const router = express.Router();
//creating an object of type Router, which is a module of express that makes it easier to create routes.

router.post('/user', createUser);
//route to create a user. it is a post, after all, we are creating data.

router.get('/user', getUsers);
//route to list all users. it is a get, after all, we are reading data.

router.get('/user/:username', getUserByUsername);
//route to read a specific user. it is a get, after all, we are reading data. the username of the user we want to read is passed as a parameter in the URL.

router.put('/user/:username', updateUser);
//route to update a user. it is a put, after all, we are updating data. the username of the user we want to update is passed as a parameter in the URL.

router.delete('/user/:username', deleteUser);
//route to delete a user. it is a delete, after all, we are deleting data. the username of the user we want to delete is passed as a parameter in the URL.



export default router;
//exporting the router object. this allows other modules to import and use the router object. in this case, we are exporting the router object so that the app.js module can use the routes defined in this module.