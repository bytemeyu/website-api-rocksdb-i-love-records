import express from 'express';
//to import the express module, which is a module that makes it easier to create HTTP servers.

//import cors from 'cors';
//to import the cors module, which is a module that makes it easier to configure CORS policies, that is, policies that define who can access the server.
//now that the website (public paste) is being served by the same server, we don't need to use the cors module anymore.

import { fileURLToPath } from 'url';
//to import the fileURLToPath module from the url module. this module is used to convert a URL to a file path.

import path from 'path'; 
//to import the path module, which is a module that provides utilities for working with file and directory paths, and here we are using it to get the directory name of the static files (public folder).

import cookieParser from 'cookie-parser';
//to import the cookie-parser module, which is a module that makes it easier to manipulate cookies.



import userRoutes from './routes/userRoutes.js';
//importing the userRoutes module, which contains the routes related to users.

import loginRoutes from './routes/loginRoutes.js';
//importing the loginRoutes module, which contains the routes related to login.

import productRoutes from './routes/productRoutes.js';
//importing the productRoutes module, which contains the routes related to products.

import orderRoutes from './routes/orderRoutes.js';
//importing the orderRoutes module, which contains the routes related to orders.



const app = express();
//creating an object of type express. this object will be the HTTP server.

//app.use(cors());
//configuring the server to use the cors module. this allows the server to accept requests from other domains.
//now that the website (public paste) is being served by the same server, we don't need to use the cors module anymore.

app.use(express.json());
//configuring the server to use the express.json module. this allows the server to understand requests that have a body in json format. it works as follows: when the client sends a request with a body in json format, the server understands the request body and transforms it into a JavaScript object. this object is then available in the request.body property.

const __filename = fileURLToPath(import.meta.url);
//__filename is a variable that contains the path of the current file. we are using the fileURLToPath module to convert the URL of import.meta.url into a local file path. import.meta.url is a feature of ESM that returns the URL of the current module.

const __dirname = path.dirname(__filename);
//__dirname is a variable that contains the directory of the current file. we are using the path.dirname module to get the directory of the current file from __filename.

app.use(express.static(path.join(__dirname, '..', 'public')));
//configuring the server to use the express.static module. this allows the server to serve static files (such as images, css, js, etc) from a specific directory. path.join(__dirname, '..', 'public') returns the absolute path to the public directory. path.join() concatenates path segments. __dirname is where we are, '..' is to up one level, and 'public' is the folder we want to serve. when we concatenate these three segments, we get the absolute path to the public directory.
//i've had to do all this because i'm using ES Modules. i chose to use ESM throughout the project because it's more modern and easier to use.
//this means that, if you have a file called index.html inside /public, it can be accessed directly through the root of your domain (in this case, http://localhost:3000/).

app.use(cookieParser());
//configuring the server to use the cookie-parser module. this allows the server to understand and manipulate cookies.



app.use('/api', userRoutes);
//configuring the server to use the routes defined in the userRoutes module. all routes defined in the userRoutes module will have /api as a prefix in the URL.

app.use('/api', loginRoutes);
//configuring the server to use the routes defined in the loginRoutes module. all routes defined in the loginRoutes module will have /api as a prefix in the URL.

app.use('/api/product', productRoutes);
//configuring the server to use the routes defined in the productRoutes module. all routes defined in the productRoutes module will have /api/product as a prefix in the URL.

app.use('/api/order', orderRoutes);
//configuring the server to use the routes defined in the orderRoutes module. all routes defined in the orderRoutes module will have /api/order as a prefix in the URL.



export default app;
//exporting the app object. this allows the app object to be used in other modules. in this case, we are exporting the app object so that the server.js module can use the app object. the server.js module is the module that starts the server.