import { Logger } from '@utils';
import app from './server';

app.listen(process.env.EXPOSE_PORT || 8080, () => {
  Logger.info('Started...');
  Logger.info('Port: ', process.env.EXPOSE_PORT || 8080);
});
