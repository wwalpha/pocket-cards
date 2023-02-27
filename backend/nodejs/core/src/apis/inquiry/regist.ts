import { Request } from 'express';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { InquiryService } from '@services';
import { ClientUtils } from '@utils';

export default async (req: Request<any, any, APIs.InquiryRegistResquest, any>): Promise<APIs.InquiryRegistResponse> => {
  const id = req.body.id;

  // データ登録
  await InquiryService.regist({ qid: id });
  // メール通知
  await sendmail(id, 'wwalpha@gmail.com');
};

const sendmail = async (id: string, email: string) => {
  const client = ClientUtils.ses();

  await client.sendEmail({
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
  });
};
