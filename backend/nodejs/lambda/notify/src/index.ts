import { SNS } from '@aws-sdk/client-sns';
import { EventBridgeEvent } from 'aws-lambda';
import { DetailType, ECSTaskStateChange } from 'typings';

const SNS_TOPIC_ARN = process.env['SNS_TOPIC_ARN'] as string;
const AWS_DEFAULT_REGION = process.env['AWS_DEFAULT_REGION'] as string;
const client = new SNS({ region: AWS_DEFAULT_REGION });

export const handler = async (event: EventBridgeEvent<DetailType, any>): Promise<any> => {
  const detailType = event['detail-type'];

  // ecs task provisioning failure
  if (detailType === 'ECS Task State Change') {
    await ecsTaskFailure(event);
  }
};

const ecsTaskFailure = async (event: EventBridgeEvent<DetailType, ECSTaskStateChange>) => {
  const region = event.region;
  const time = new Date(event.time);
  const cluster = event.detail.clusterArn.split('/')[1];
  const service = event.detail.group.split(':')[1];
  const stopCode = event.detail.stopCode;
  const stopReason = event.detail.stoppedReason;

  // send notification
  await client.publish({
    TopicArn: SNS_TOPIC_ARN,
    Subject: 'ECS Task Provisioning Failure',
    Message: `Region: ${region}
    Time: ${time.toLocaleString()}
    Cluster: ${cluster}
    Service: ${service}
    Stop Code: ${stopCode}
    Stop Reason: ${stopReason}
    `,
  });
};
