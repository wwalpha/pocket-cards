import { Consts } from '@constants';

export const API_URL = process.env.API_URL as string;
export const API_NAME = 'api';
export const API_VERSION = '/v1';

export const SIGN_IN = () => `${API_VERSION}/auth/login`;
export const SIGN_UP = () => `${API_VERSION}/users`;
export const REFRESH_TOKEN = () => `${API_VERSION}/auth/refresh`;

// 学習練習
export const DAILY_PRACTICE = () => `${API_VERSION}/study/daily/practice/questions?subject=${Consts.SUBJECT.ENGLISH}`;
// 学習テスト
export const DAILY_TEST = () => `${API_VERSION}/study/daily/test/questions?subject=${Consts.SUBJECT.ENGLISH}`;
// 学習テスト
export const DAILY_ANSWER = (questionId: string) => `${API_VERSION}/study/daily/test/questions/${questionId}`;
