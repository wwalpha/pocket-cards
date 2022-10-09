import { Request } from 'express';
import Axios from 'axios';
import { S3 } from 'aws-sdk';
import { APIs } from 'typings';

const client = new S3({ region: process.env['DEFAULT_REGION'] });

const BUCKET_NAME = process.env['BUCKET_NAME'] as string;
const VISION_API_URL = process.env['VISION_API_URL'];
const VISION_API_KEY = process.env['VISION_API_KEY'];

export default async (req: Request<any, any, APIs.HandwritingRequest, any>): Promise<APIs.HandwritingResponse> => {
  const { key } = req.body;

  // get s3 object
  const object = await client
    .getObject({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    .promise();

  // convert image to texts
  const res = await Axios.post(`${VISION_API_URL}/image2texts?key=${VISION_API_KEY}`, {
    content: object.Body?.toString('base64'),
  });

  const datas = res.data as string[];

  return {
    results: datas,
  };
};
