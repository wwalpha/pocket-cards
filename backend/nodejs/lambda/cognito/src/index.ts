import { PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';
import app from './app';

// イベント入口
export const handler = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
  console.log(event);

  try {
    return await app(event);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
