export type DetailType = 'ECS Task State Change';

export interface ECSTaskStateChange {
  attachments: [
    {
      id: string;
      type: string;
      status: string;
      details: {
        name: string;
        value: string;
      }[];
    }
  ];
  attributes: [
    {
      name: string;
      value: string;
    }
  ];
  availabilityZone: string;
  capacityProviderName: string;
  clusterArn: string;
  connectivity: string;
  connectivityAt: string;
  containers: [
    {
      containerArn: string;
      lastStatus: string;
      name: string;
      image: string;
      runtimeId: string;
      taskArn: string;
      networkInterfaces: {
        attachmentId: string;
        privateIpv4Address: string;
      }[];
      cpu: string;
    }
  ];
  cpu: string;
  createdAt: string;
  desiredStatus: string;
  enableExecuteCommand: boolean;
  ephemeralStorage: {
    sizeInGiB: 20;
  };
  executionStoppedAt: string;
  group: string;
  launchType: string;
  lastStatus: string;
  memory: string;
  overrides: {
    containerOverrides: [
      {
        name: string;
      }
    ];
  };
  platformVersion: string;
  pullStartedAt: string;
  startedBy: string;
  stoppingAt: string;
  stoppedAt: string;
  stoppedReason: string;
  stopCode: string;
  taskArn: string;
  taskDefinitionArn: string;
  updatedAt: string;
  version: 4;
}
