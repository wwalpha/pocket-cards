import { ECS } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN as string;
const SERVICE_ARN_BACKEND = process.env.SERVICE_ARN_BACKEND as string;
const SERVICE_ARN_AUTH = process.env.SERVICE_ARN_AUTH as string;

const client = new ECS();

export default async () => {
  await stopServices(SERVICE_ARN_BACKEND);

  await stopServices(SERVICE_ARN_AUTH);
};

const stopServices = async (service: string) => {
  // update service
  await client
    .updateService({
      cluster: CLUSTER_ARN,
      service: service,
      desiredCount: 0,
    })
    .promise();

  // list tasks
  const tasks = await client
    .listTasks({
      cluster: CLUSTER_ARN,
    })
    .promise();

  // stop tasks
  const allTask = tasks.taskArns?.map((item) =>
    client
      .stopTask({
        cluster: CLUSTER_ARN,
        task: item,
      })
      .promise()
  );

  if (!allTask) return;

  await Promise.all(allTask);
};
