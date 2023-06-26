import { DeleteObjectCommand, GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import Axios from 'axios';
import { S3Handler } from 'aws-lambda';

const client = new S3({ region: process.env['AWS_REGION'] });
const mail = new SESClient({ region: process.env['AWS_REGION'] });

const VISION_API_URL = process.env.VISION_API_URL;
const VISION_API_KEY = process.env.VISION_API_KEY;
const MASTER_EMAIL_ADDRESS = process.env.MASTER_EMAIL_ADDRESS as string;
const TARGET_EMAIL_ADDRESS = process.env.TARGET_EMAIL_ADDRESS as string;

export const handler: S3Handler = async (e) => {
  const bucket = e.Records[0].s3.bucket.name;
  const key = e.Records[0].s3.object.key;

  const object = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const content = await object.Body?.transformToString("base64");

  let url = `${VISION_API_URL}/image2lines?key=${VISION_API_KEY}`;

  if (key.startsWith('pdf')) {
    url =  `${VISION_API_URL}/pdf2lines?key=${VISION_API_KEY}`;
  }

  const res = await Axios.post(url, {
    content: content,
  });

  const datas = res.data as string[];

  const response = datas.filter((item) => {
    const chars = item.split('');

    const filters = chars.filter((item) => japanese.includes(item));

    return chars.length !== filters.length;
  });

  await mail.send(
    new SendEmailCommand({
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
  );

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
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
