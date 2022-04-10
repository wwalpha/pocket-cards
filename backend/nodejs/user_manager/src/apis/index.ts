import { Environments } from '@consts';
import AWS from 'aws-sdk';

export { CreateUser } from './CreateUser';
export { CreateStudent } from './CreateStudent';
export { CreateAdminUser } from './CreateAdminUser';
export { ListAdminUsers } from './ListAdminUsers';
export { ListStudents } from './ListStudents';
export { LookupUser } from './LookupUser';
export { DescribeUser } from './DescribeUser';
export { UpdateUser } from './UpdateUser';

// health check
export const HealthCheck = async () => ({ service: 'User Manager', isAlive: true });

// update aws config
AWS.config.update({
  region: Environments.AWS_REGION,
  dynamodb: { endpoint: Environments.AWS_ENDPOINT },
});
