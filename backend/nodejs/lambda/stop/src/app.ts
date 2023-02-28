import { ECSClient, ListTasksCommand, StopTaskCommand, UpdateServiceCommand } from '@aws-sdk/client-ecs';

const CLUSTER_ARN = process.env.CLUSTER_ARN as string;
const SERVICE_ARN_BACKEND = process.env.SERVICE_ARN_BACKEND as string;
const SERVICE_ARN_AUTH = process.env.SERVICE_ARN_AUTH as string;
const SERVICE_ARN_USERS = process.env.SERVICE_ARN_USERS as string;

const client = new ECSClient({});

export default async () => {
  await stopServices(SERVICE_ARN_BACKEND);

  await stopServices(SERVICE_ARN_AUTH);

  await stopServices(SERVICE_ARN_USERS);
};

const stopServices = async (service: string) => {
  // update service
  await client.send(
    new UpdateServiceCommand({
      cluster: CLUSTER_ARN,
      service: service,
      desiredCount: 0,
    })
  );

  // list tasks
  const tasks = await client.send(
    new ListTasksCommand({
      cluster: CLUSTER_ARN,
    })
  );

  // stop tasks
  const allTask = tasks.taskArns?.map((item) =>
    client.send(
      new StopTaskCommand({
        cluster: CLUSTER_ARN,
        task: item,
      })
    )
  );

  if (!allTask) return;

  await Promise.all(allTask);
};
