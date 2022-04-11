import { Logger } from '@utils';
import app from './app';

app.listen(process.env['EXPOSE_PORT'] || 8080, () => {
  Logger.info('Started...');
  Logger.info('Port: ', process.env['EXPOSE_PORT'] || 8080);

  console.log('started...');
});
