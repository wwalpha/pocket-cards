import { Request } from 'express';
import Axios from 'axios';
import { APIs } from 'typings';
import {  Environment } from '@consts';
import { ClientUtils } from '@utils';

const client = ClientUtils.s3();

export default async (req: Request<any, any, APIs.Image2TextRequest, any>): Promise<APIs.Image2TextResponse> => {
  const { key } = req.body;

  // get s3 object
  const object = await client.getObject({
    Bucket: Environment.BUCKET_NAME_MATERAILS,
    Key: key,
  });

  const content = await object.Body?.transformToString('base64');

  // convert image to texts
  const res = await Axios.post(`${Environment.VISION_API_URL}/image2lines?key=${Environment.VISION_API_KEY}`, {
    content: content,
  });

  const results = Array.isArray(res.data) ? res.data : [];

  return {
    results: results,
  };
};
