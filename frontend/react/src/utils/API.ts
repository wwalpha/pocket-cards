import { API } from '@aws-amplify/api';
import { Consts } from '@constants';

export const get = async <Res = any>(path: string, headers?: any, name: string = Consts.API_NAME): Promise<Res> =>
  await API.get(name, path, {
    headers,
  });

export const put = async <Res = any, Req = any>(
  path: string,
  body?: Req,
  name: string = Consts.API_NAME
): Promise<Res> =>
  await API.put(name, path, {
    body,
  });

export const post = async <Res = any, Req = any>(
  path: string,
  body?: Res,
  name: string = Consts.API_NAME
): Promise<Req> =>
  await API.post(name, path, {
    body,
  });

export const del = async <Res = any>(path: string, body?: any, name: string = Consts.API_NAME): Promise<Res> =>
  await API.del(name, path, {
    body,
  });
