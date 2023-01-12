export const PORT = Number(process.env.PORT) || 4000;

export const IS_MULTI_MODE = process.env.MODE === 'multi';

export const BASE_PROTOCOL_WITH_HOSTNAME = 'http://localhost';

export const REQUEST = {
  isRedirected: false,
};
