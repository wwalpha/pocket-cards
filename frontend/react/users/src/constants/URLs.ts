import { Consts } from '@constants';

export const API_URL = process.env.API_URL as string;
export const API_NAME = 'api';
export const API_VERSION = '/v1';

export const SIGN_IN = () => `${API_VERSION}/auth/login`;
export const SIGN_UP = () => `${API_VERSION}/users`;
export const REFRESH_TOKEN = () => `${API_VERSION}/auth/refresh`;
export const INQUIRY = () => `${API_VERSION}/inquiries`;

// 学習練習
export const DAILY_PRACTICE = () => `${API_VERSION}/study/daily/practice`;
// 学習テスト
export const DAILY_EXAM = () => `${API_VERSION}/study/daily/exam`;
// 学習テスト
export const DAILY_ANSWER = () => `${API_VERSION}/study/daily/answer`;

// 単語無視
export const STUDY_IGNORE = (groupId: string) => `${API_VERSION}/groups/${groupId}/questions/ignore`;
