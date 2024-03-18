import express, { Express } from "express";
import { routes } from "./routes/routes";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware";
const app: Express = express();
app.use(express.json());
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;