import { SES } from 'aws-sdk';
import { Request } from 'express';
import { Commons, DBHelper } from '@utils';
import { Users } from '@queries';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';

export default async (req: Request<any, any, APIs.InquiryResquest, any>): Promise<APIs.InquiryResponse> => {
  const userId = Commons.getUserId(req);
  const id = req.body.id;

  const results = await DBHelper().get<Tables.TUsers>(Users.get(userId));

  if (!results?.Item) {
    return;
  }

  const guardian = results.Item.teacher;

  if (guardian) {
    await sendmail(id, guardian);
  }
};

const sendmail = async (id: string, email: string) => {
  const client = new SES();

  await client
    .sendEmail({
      Source: Environment.MASTER_EMAIL_ADDRESS,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: '【勉強にゃん】問い合わせの知らせ',
        },
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: `${id}`,
          },
        },
      },
    })
    .promise();
};
