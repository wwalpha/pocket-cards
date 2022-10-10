import { Request } from 'express';
import Axios from 'axios';
import { S3 } from 'aws-sdk';
import { APIs } from 'typings';
import { Consts, Environment } from '@consts';

const client = new S3({ region: process.env['DEFAULT_REGION'] });

export default async (req: Request<any, any, APIs.HandwritingRequest, any>): Promise<APIs.HandwritingResponse> => {
  const { key } = req.body;

  // get s3 object
  const object = await client
    .getObject({
      Bucket: Environment.BUCKET_NAME_UPLOADS,
      Key: `${Consts.PATH_PUBLIC}/${key}`,
    })
    .promise();

  // convert image to texts
  const res = await Axios.post(`${Environment.VISION_API_URL}/image2texts?key=${Environment.VISION_API_KEY}`, {
    content: object.Body?.toString('base64'),
  });

  const datas = res.data as string[];

  return {
    results: datas,
  };
};
