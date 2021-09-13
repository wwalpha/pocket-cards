import { API } from '@aws-amplify/api';
import { Consts } from '@constants';

export const get = async <T = any>(path: string, headers?: any, name: string = Consts.API_NAME): Promise<T> =>
  await API.get(name, path, {
    headers,
  });

export const put = async <T = any>(path: string, body?: any, name: string = Consts.API_NAME): Promise<T> =>
  await API.put(name, path, {
    body,
  });

export const post = async <T = any>(path: string, body?: any, name: string = Consts.API_NAME): Promise<T> =>
  await API.post(name, path, {
    body,
  });

export const del = async <T = any>(path: string, body?: any, name: string = Consts.API_NAME): Promise<T> =>
  await API.del(name, path, {
    body,
  });
