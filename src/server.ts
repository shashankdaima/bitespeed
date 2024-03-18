import app  from './app'; // app.ts
import { config } from './config'; // config.ts

const server = app.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});

export { server };
