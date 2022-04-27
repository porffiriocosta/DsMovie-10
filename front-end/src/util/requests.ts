import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import history from './history';
import { getAuthData, removeAuthData } from './storage';
import { toast } from 'react-toastify';


export const BASE_URL =
  process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:8080';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? 'myclientid';
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET ?? 'myclientsecret';


type LoginData = {
  username: string;
  password: string;
};

export const requestBackendLogin = (loginData: LoginData) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + window.btoa(CLIENT_ID + ':' + CLIENT_SECRET),
  };

  const data = qs.stringify({
    ...loginData,
    grant_type: 'password',
  });

  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/oauth/token',
    data,
    headers,
  });
};

export const requestBackend = (config: AxiosRequestConfig) => {
  const headers = config.withCredentials
    ? {
        ...config.headers,
        Authorization: 'Bearer ' + getAuthData().access_token,
      }
    : config.headers;
  return axios({ ...config, baseURL: BASE_URL, headers });
};

const errorHandler = (error: { response: { status: any; }; config: { url: any; }; }) => { 
  try {
    if(error.response.status === 500 ) {
      toast.error('Ocorreu um erro favor contatar o admiistrador');
    }
    else if (error.response.status === 401) {
      toast.error('Usuario sem autorização');
    }
  } 
  catch {
    if (error.response === undefined) {
      removeAuthData();
      toast.info('Erro no servidor!');
      history.push("/")
    }
  }
  finally {
    return Promise.reject({ ...error })
  }
}

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  error => errorHandler(error)
);

axios.interceptors.response.use(
  response => response,
  error => errorHandler(error)
);


