import cluster from 'cluster';
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

export const sendError = (statusCode: number, errorMessage: string, res: ServerResponse) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  const result = { ok: false, error: errorMessage };
  res.end(JSON.stringify(result));
};

export const sendInvalidEndpointError = (res: ServerResponse) =>
  sendError(404, `Invalid endpoint.`, res);

export const sendUserDoesNotExistError = (res: ServerResponse) =>
  sendError(404, `User with such ID doesn't exist.`, res);

export const sendInternalServerError = (res: ServerResponse) =>
  sendError(500, 'Internal server error.', res);

export const sendInvalidBodyError = (res: ServerResponse) =>
  sendError(400, `Invalid request's body.`, res);

export const sendInvalidIdError = (res: ServerResponse) => sendError(400, 'Invalid ID.', res);

export const sendDataInJSON = (
  statusCode: number,
  data: User | User[] | null,
  res: ServerResponse
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  const result = { ok: true, data };
  res.end(JSON.stringify(result));
};

export const validateId = (id: string) => {
  const [timeLow, timeMid, timeHi, clockSeq, node] = id.split('-').map((elem) => elem.length);
  return !(timeLow !== 8 || timeMid !== 4 || timeHi !== 4 || clockSeq !== 4 || node !== 12);
};

export const shareDataToWorkers = (data: User[]) => {
  if (cluster.workers) {
    const workers = Object.values(cluster.workers);
    workers.forEach((worker) => {
      if (worker) {
        worker.send(data);
      }
    });
  }
};
