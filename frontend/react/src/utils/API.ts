import axios from 'axios';
import Credentials from './Credentials';

axios.interceptors.request.use(
  async (config) => {
    return Credentials.getSession().then((value) => {
      config.headers['Authorization'] = value?.idToken;

      return Promise.resolve(config);
    });
  },
  () => {}
);

axios.defaults.baseURL = process.env.API_URL;

// get method
export const get = async <Res = any>(path: string): Promise<Res> => {
  const res = await axios.get(path);

  return res.data;
};

// put method
export const put = async <Res = any, Req = any>(path: string, data?: Req): Promise<Res> => {
  const res = await axios.put(path, data);

  return res.data;
};

// post method
export const post = async <Res = any, Req = any>(path: string, data?: Req): Promise<Res> => {
  const res = await axios.post(path, data);

  return res.data;
};

// delete method
export const del = async <Res = any>(path: string): Promise<Res> => {
  const res = await axios.delete(path);

  return res.data;
};
