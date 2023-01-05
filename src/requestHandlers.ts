import { IncomingMessage, ServerResponse } from 'http';
import { createUser, getAllUsers, getUserById, removeUserById, updateUserById } from './data.js';
import { sendDataInJSON, sendError, sendInvalidBodyError, sendInvalidUrlError } from './helpers.js';

export const handleGetAllUsers = (res: ServerResponse) => {
  if (res.writableEnded) return;

  const users = getAllUsers();
  sendDataInJSON(200, users, res);
};

export const handleGetUserById = (id: string, res: ServerResponse) => {
  if (res.writableEnded) return;

  const operationResult = getUserById(id);
  if (operationResult.isDone) {
    sendDataInJSON(operationResult.statusCode, operationResult.data, res);
  } else {
    sendError(operationResult.statusCode, operationResult.message, res);
  }
};

export const handleCreateUser = (id: string, req: IncomingMessage, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (id) {
    sendInvalidUrlError(res);
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      const operationResult = createUser(parsedBody);

      if (operationResult.isDone) {
        sendDataInJSON(operationResult.statusCode, operationResult.data, res);
      } else {
        sendError(operationResult.statusCode, operationResult.message, res);
      }
    } catch {
      sendInvalidBodyError(res);
    }
  });
};

export const handleUpdateUserById = (id: string, req: IncomingMessage, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (!id) {
    sendInvalidUrlError(res);
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      const operationResult = updateUserById(id, parsedBody);

      if (operationResult.isDone) {
        sendDataInJSON(operationResult.statusCode, operationResult.data, res);
      } else {
        sendError(operationResult.statusCode, operationResult.message, res);
      }
    } catch {
      sendInvalidBodyError(res);
    }
  });
};

export const handleRemoveUserById = (id: string, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (!id) {
    sendInvalidUrlError(res);
    return;
  }

  const operationResult = removeUserById(id);

  if (operationResult.isDone) {
    sendDataInJSON(operationResult.statusCode, null, res);
  } else {
    sendError(operationResult.statusCode, operationResult.message, res);
  }
};