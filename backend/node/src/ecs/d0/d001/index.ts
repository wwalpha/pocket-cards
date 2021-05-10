import { Request } from 'express';
import Axios, { AxiosResponse } from 'axios';
import { Environment } from '@consts';
import { VisionRequest, VisionResponse } from 'typings/types';
import { API } from 'typings';

const visionUrl = Environment.VISION_URL;
const visionApiKey = Environment.VISION_API_KEY;

export default async (req: Request<any, any, API.D001Request, any>): Promise<API.D001Response> => {
  const input = req.body;

  console.log(visionUrl, visionApiKey);
  // get image words
  const res = await Axios.post<VisionRequest, AxiosResponse<VisionResponse>>(
    `${visionUrl}/image2words?key=${visionApiKey}`,
    {
      content: input.content,
      language: input.language,
    }
  );

  return {
    count: res.data.length,
    words: res.data,
  };
};
