import { ECS } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN as string;
const SERVICE_ARN_BACKEND = process.env.SERVICE_ARN_BACKEND as string;
const SERVICE_ARN_AUTH = process.env.SERVICE_ARN_AUTH as string;

export default async () => {
  const ecs = new ECS();

  // update service
  await ecs
    .updateService({
      cluster: CLUSTER_ARN,
      service: SERVICE_ARN_BACKEND,
      desiredCount: 1,
    })
    .promise();

  // update service
  await ecs
    .updateService({
      cluster: CLUSTER_ARN,
      service: SERVICE_ARN_AUTH,
      desiredCount: 1,
    })
    .promise();
};
