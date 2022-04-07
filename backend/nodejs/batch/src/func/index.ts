import AWS from 'aws-sdk';
import { Environments } from '@utils';

// update aws config
AWS.config.update({
  region: Environments.AWS_REGION,
});

export { default as TraceCount } from './traces';
export { default as Scheduler } from './scheduler';
