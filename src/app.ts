/**
 * Imports Express and the routes.
 * Sets up Swagger docs.
 * Registers routes, middlewares, and error handlers.
*/

import express, { Express } from "express";

const app: Express = express();

app.use(express.json());


app.get('/helloworld', (req, res) => {
  res.send('Hello, World!');
});


export default app;
