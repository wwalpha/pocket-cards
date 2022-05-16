import { URLs } from '@constants';
import axios, { AxiosRequestConfig } from 'axios';
import Credentials from './Credentials';

axios.interceptors.request.use(
  async (config) => {
    if (config.url === URLs.SIGN_IN()) {
      return config;
    }

    const tokens = await Credentials.getSession();

    if (config.headers && tokens?.idToken) {
      config.headers['Authorization'] = tokens?.idToken;
    }

    return config;
  },
  () => {}
);

axios.defaults.baseURL = process.env.API_URL;

// get method
export const get = async <Res = any>(path: string, config?: AxiosRequestConfig): Promise<Res> => {
  try {
    const res = await axios.get(path, config);

    return res.data;
  } catch (err) {
    throw err;
  }
};

// put method
export const put = async <Res = any, Req = any>(
  path: string,
  data?: Req,
  config?: AxiosRequestConfig
): Promise<Res> => {
  try {
    const res = await axios.put(path, data, config);

    return res.data;
  } catch (err) {
    throw err;
  }
};

// post method
export const post = async <Res = any, Req = any>(
  path: string,
  data?: Req,
  config?: AxiosRequestConfig
): Promise<Res> => {
  try {
    const res = await axios.post(path, data, config);

    return res.data;
  } catch (err) {
    throw err;
  }
};

// delete method
export const del = async <Res = any>(path: string): Promise<Res> => {
  try {
    const res = await axios.delete(path);

    return res.data;
  } catch (err) {
    throw err;
  }
};
