import { ECS } from 'aws-sdk';

const CLUSTER_ARN = process.env.CLUSTER_ARN as string;
const SERVICE_ARN = process.env.SERVICE_ARN as string;

export default async () => {
  const ecs = new ECS();

  // update service
  await ecs
    .updateService({
      cluster: CLUSTER_ARN,
      service: SERVICE_ARN,
      desiredCount: 0,
    })
    .promise();

  // list tasks
  const tasks = await ecs
    .listTasks({
      cluster: CLUSTER_ARN,
    })
    .promise();

  // stop tasks
  const allTask = tasks.taskArns?.map((item) =>
    ecs
      .stopTask({
        cluster: CLUSTER_ARN,
        task: item,
      })
      .promise()
  );

  if (!allTask) return;

  await Promise.all(allTask);
};
