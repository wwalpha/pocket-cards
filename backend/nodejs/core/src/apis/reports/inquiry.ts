import { SES } from 'aws-sdk';
import { Request } from 'express';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { InquiryService } from '@services';

export default async (req: Request<any, any, APIs.InquiryResquest, any>): Promise<APIs.InquiryResponse> => {
  const id = req.body.id;

  // データ登録
  await InquiryService.regist({ qid: id });

  // メール通知
  await sendmail(id, 'wwalpha@gmail.com');
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
