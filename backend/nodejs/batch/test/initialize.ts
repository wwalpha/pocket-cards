import { SSM } from '@aws-sdk/client-ssm';
import * as path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.credentials') });

/** SSM初期化 */
const registSSM = async () => {
  const get = new SSM({
    region: process.env['DEFAULT_REGION'],
    credentials: {
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'] as string,
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] as string,
    },
  });

  const ipa = (
    await get.getParameter({
      Name: process.env['IPA_API_KEY'] as string,
      WithDecryption: true,
    })
  ).Parameter?.Value;

  const translate = (
    await get.getParameter({
      Name: process.env['TRANSLATION_API_KEY'] as string,
      WithDecryption: true,
    })
  ).Parameter?.Value;

  if (!ipa || !translate) return;

  const set = new SSM({
    endpoint: process.env['AWS_ENDPOINT'],
  });

  await set.putParameter({
    Name: process.env['IPA_API_KEY'] as string,
    Value: ipa,
    Type: 'SecureString',
  });

  await set.putParameter({
    Name: process.env['TRANSLATION_API_KEY'] as string,
    Value: translate,
    Type: 'SecureString',
  });
};

(async () => {
  console.log('regist ssm...');
  await registSSM();
})();
