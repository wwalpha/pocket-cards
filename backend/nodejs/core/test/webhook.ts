import { SNSHandler } from 'aws-lambda';
import * as https from 'node:https';

const WEBHOOK_URL = process.env.WEBHOOK_URL as string;

export const handler: SNSHandler = (event) => {
  const sns = event.Records[0].Sns;
  const context = JSON.parse(sns.Message) as any;
  const payload = context.responsePayload;

  const datas = JSON.stringify({
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.2',
          body: [
            {
              type: 'TextBlock',
              text: payload.errorType,
              size: 'Large',
              weight: 'Bolder',
              spacing: 'None',
            },
            {
              type: 'TextBlock',
              text: payload.errorMessage,
              wrap: true,
            },
          ],
        },
      },
    ],
  });

  const request = https.request(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(datas),
    },
  });

  request.write(datas);
  request.end();
};
