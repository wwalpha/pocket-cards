import AWS from 'aws-sdk';
import { Environments } from '@utils';

// update aws config
AWS.config.update({
  region: Environments.AWS_REGION,
});

export { default as CreateReports } from './reports';
export { default as Scheduler } from './scheduler';
export { default as LearningStatus } from './learningStatus';
