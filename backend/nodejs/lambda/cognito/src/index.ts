import { PostAuthenticationTriggerEvent } from 'aws-lambda';
import app from './app';

// イベント入口
export const handler = async (event: PostAuthenticationTriggerEvent) => {
  console.log(event);

  try {
    return await app(event);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
