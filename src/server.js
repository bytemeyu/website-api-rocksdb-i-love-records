import dotenv from 'dotenv';
//to import the dotenv. to use the dotenv config method, you need to call the config() method of the dotenv object. the config() method loads the environment variables from the .env file into the process.env.

dotenv.config();
//calling the config() method of the dotenv object, that is, loading the environment variables from the .env file into the process.env.

//to ensure that the environment variables are available to the entire application from the beginning, it is necessary to import dotenv and call the config() method at the beginning of the server.js file (before importing any other modules).

import app from './app.js';
//importing the app object from the app.js module. the app object is the HTTP server.

const port = process.env.PORT || 3000;
//declaring the constant that will define the port that the server will listen to. in this case, instead of just 3000, we put 'process.env.PORT'. all this means "Set port as the value of the PORT environment variable if it is defined (in the .env file) and has a truthy value; otherwise, use 3000 as the default value.". the use of process.env.PORT allows the port number to be configured externally, which is a common practice in hosting or deployment environments, such as AWS or others.

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
//the code above starts the HTTP server. the 'app.listen()' method binds and listens for connections on the defined port. the callback function is executed as soon as the server starts listening, printing a message in the console informing that the server is running and the port it is listening to.

//FALTA: implementar HTTPS (Let's Encrypt?);