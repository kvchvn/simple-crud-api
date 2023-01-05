import { ServerResponse } from 'http';
import { BadResult, GoodResult, User } from './types.js';

export const validateFields = (
  userData: Record<string, unknown>
): Pick<GoodResult, 'isDone'> | Pick<BadResult, 'isDone' | 'message'> => {
  if (!('username' in userData) || !('age' in userData) || !('hobbies' in userData)) {
    return {
      isDone: false,
      message: 'These fields are required: username, age, hobbies.',
    };
  }
  if (typeof userData.username !== 'string') {
    return {
      isDone: false,
      message: `Field 'username' should be string.`,
    };
  }
  if (typeof userData.age !== 'number') {
    return {
      isDone: false,
      message: `Field 'age' should be number.`,
    };
  }
  if (
    !Array.isArray(userData.hobbies) ||
    !userData.hobbies.every((item) => typeof item === 'string')
  ) {
    return {
      isDone: false,
      message: `Field 'hobbies' should be array of strings or empty array`,
    };
  }
  return {
    isDone: true,
  };
};

export const sendError = (statusCode: number, message: string, res: ServerResponse) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  const result = { status: 'error', message };
  res.end(JSON.stringify(result));
};

export const sendInvalidUrlError = (res: ServerResponse) =>
  sendError(404, `Request's url is invalid.`, res);

export const sendInternalServerError = (res: ServerResponse) =>
  sendError(500, 'Internal server error.', res);

export const sendInvalidBodyError = (res: ServerResponse) =>
  sendError(400, `Request's body is invalid.`, res);

export const sendInvalidIdError = (res: ServerResponse) => sendError(400, 'Invalid ID.', res);

export const sendDataInJSON = (
  statusCode: number,
  data: User | User[] | null,
  res: ServerResponse
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  const result = { status: 'ok', data };
  res.end(JSON.stringify(result));
};

export const validateId = (id: string) => {
  const [timeLow, timeMid, timeHi, clockSeq, node] = id.split('-').map((elem) => elem.length);
  return !(timeLow !== 8 || timeMid !== 4 || timeHi !== 4 || clockSeq !== 4 || node !== 12);
};
