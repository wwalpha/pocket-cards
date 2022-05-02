import { SES } from 'aws-sdk';
import { Request } from 'express';
import { Environment } from '@consts';
import { APIs } from 'typings';

export default async (req: Request<any, any, APIs.InquiryResquest, any>): Promise<APIs.InquiryResponse> => {
  const id = req.body.id;

  // const adminUser = await getAdminUser();

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

// const getAdminUser = async () => {
//   // get user information
//   const response = await axios.get<Users.ListAdminUsersRequest, AxiosResponse<Users.ListAdminUsersResponse>>(
//     Consts.API_URLs.listAdmins()
//   );

//   // user not found
//   if (response.status !== 200) {
//     throw new Error('User not found.');
//   }

//   return response.data.users[0];
// };
