import { DescribeTasksCommand, ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';

const CLUSTER_ARN = process.env.CLUSTER_ARN;

export default async () => {
  const ecs = new ECSClient({
    region: process.env['AWS_REGION'],
  });

  // list tasks
  const tasks = await ecs.send(
    new ListTasksCommand({
      cluster: CLUSTER_ARN,
    })
  );

  // list numbers check
  if (!tasks.taskArns || tasks.taskArns.length === 0) {
    return {
      status: 'STOPPED',
    };
  }

  const details = await ecs.send(
    new DescribeTasksCommand({
      cluster: CLUSTER_ARN,
      tasks: tasks.taskArns,
    })
  );

  if (!details.tasks || details.tasks.length === 0) {
    return {
      status: 'STOPPED',
    };
  }

  const task = details.tasks[0];

  return {
    status: task.lastStatus,
  };
};
