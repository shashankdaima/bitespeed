/**
 * Imports Express and the routes.
 * Sets up Swagger docs.
 * Registers routes, middlewares, and error handlers.
*/

import express, { Express } from "express";
import { routes } from "./routes/routes";
import swaggerUi from "swagger-ui-express";

import notFoundMiddleware from "./middlewares/notFound.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
import specs from "./swagger.config";

const app: Express = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

export default app;
