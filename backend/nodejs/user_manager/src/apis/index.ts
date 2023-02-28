export { CreateUser } from './CreateUser';
export { CreateStudent } from './CreateStudent';
export { CreateAdminUser } from './CreateAdminUser';
export { ListAdminUsers } from './ListAdminUsers';
export { ListStudents } from './ListStudents';
export { ListCurriculums } from './ListCurriculums';

export { LookupUser } from './LookupUser';
export { DescribeUser } from './DescribeUser';
export { UpdateUser } from './UpdateUser';

// health check
export const HealthCheck = async () => ({ service: 'User Manager', isAlive: true });
