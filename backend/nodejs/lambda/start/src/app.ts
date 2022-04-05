import { ECS } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN as string;
const SERVICE_ARN_BACKEND = process.env.SERVICE_ARN_BACKEND as string;
const SERVICE_ARN_AUTH = process.env.SERVICE_ARN_AUTH as string;
const SERVICE_ARN_USERS = process.env.SERVICE_ARN_USERS as string;
const client = new ECS();

export default async () => {
  // update service
  await startService(SERVICE_ARN_BACKEND);
  // update service
  await startService(SERVICE_ARN_AUTH);
  // update service
  await startService(SERVICE_ARN_USERS);
};

const startService = async (servie: string) => {
  // update service
  await client
    .updateService({
      cluster: CLUSTER_ARN,
      service: servie,
      desiredCount: 1,
    })
    .promise();
};
