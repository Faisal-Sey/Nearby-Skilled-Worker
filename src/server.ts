import { App } from './app';
import { ValidateEnv } from './utils/validateEnv';
import Routes from './routes/index.route';

ValidateEnv();

const app = new App(Routes);

app.listen();
