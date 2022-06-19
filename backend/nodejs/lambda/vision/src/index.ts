import Axios from 'axios';
import { S3Handler } from 'aws-lambda';
import { S3, SES } from 'aws-sdk';

const client = new S3({ region: process.env.DEFAULT_REGION });
const mail = new SES({ region: process.env.DEFAULT_REGION });

const VISION_API_URL = process.env.VISION_API_URL;
const VISION_API_KEY = process.env.VISION_API_KEY;
const MASTER_EMAIL_ADDRESS = process.env.MASTER_EMAIL_ADDRESS as string;
const TARGET_EMAIL_ADDRESS = process.env.TARGET_EMAIL_ADDRESS as string;

export const handler: S3Handler = async (e) => {
  const bucket = e.Records[0].s3.bucket.name;
  const key = e.Records[0].s3.object.key;

  const object = await client
    .getObject({
      Bucket: bucket,
      Key: key,
    })
    .promise();

  const res = await Axios.post(`${VISION_API_URL}/image2texts?key=${VISION_API_KEY}`, {
    content: object.Body?.toString('base64'),
  });

  const datas = res.data as string[];

  const response = datas.filter((item) => {
    const chars = item.split('');

    const filters = chars.filter((item) => japanese.includes(item));

    return chars.length !== filters.length;
  });

  await mail
    .sendEmail({
      Source: MASTER_EMAIL_ADDRESS,
      Destination: {
        ToAddresses: [TARGET_EMAIL_ADDRESS],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: `${key}の解析結果`,
        },
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: response.join('\n'),
          },
        },
      },
    })
    .promise();

  await client
    .deleteObject({
      Bucket: bucket,
      Key: key,
    })
    .promise();
};

const japanese = [
  'あ',
  'い',
  'う',
  'え',
  'お',
  'か',
  'き',
  'く',
  'け',
  'こ',
  'さ',
  'し',
  'す',
  'せ',
  'そ',
  'た',
  'ち',
  'つ',
  'て',
  'と',
  'な',
  'に',
  'ぬ',
  'ね',
  'の',
  'は',
  'ひ',
  'ふ',
  'へ',
  'ほ',
  'ま',
  'み',
  'む',
  'め',
  'も',
  'が',
  'ぎ',
  'ぐ',
  'げ',
  'ご',
  'ざ',
  'じ',
  'ず',
  'ぜ',
  'ぞ',
  'だ',
  'ぢ',
  'づ',
  'で',
  'ど',
  'ば',
  'び',
  'ぶ',
  'べ',
  'ぼ',
  'ぱ',
  'ぴ',
  'ぷ',
  'ぺ',
  'ぽ',
  'や',
  'ゆ',
  'よ',
  'ー',
  'ん',
  'ゃ',
  'ゅ',
  'ぅ',
  'っ',
  'ら',
  'り',
  'る',
  'れ',
  'ろ',
  'わ',
  'を',
];
