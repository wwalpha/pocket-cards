export const Environments = {
  AWS_REGION: process.env.AWS_REGION as string,
  AWS_ENDPOINT: process.env.AWS_ENDPOINT as string,
  TABLE_NAME_SETTINGS: process.env.TABLE_NAME_SETTINGS as string,
  TABLE_NAME_USERS: process.env.TABLE_NAME_USERS as string,
  TABLE_NAME_CURRICULUMS: process.env.TABLE_NAME_CURRICULUMS as string,
  TABLE_NAME_GROUPS: process.env['TABLE_NAME_GROUPS'] as string,
};

export const Authority = {
  ADMIN: 'TENANT_ADMIN',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
};
