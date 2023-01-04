import { createServer } from 'http';
import {
  sendDataInJSON,
  sendError,
  sendInternalServerError,
  sendInvalidBodyError,
  sendInvalidUrlError,
} from './helpers.js';
import { Endpoints } from './types.js';
const server = createServer();

server.on('request', (req, res) => {
  try {
    const { url, method } = req;
    const urlArray = url ? url.split('/').slice(1) : [''];
    const [reqPath, reqSubPath, id] = urlArray;

    // Invalid url
    if (
      reqPath !== Endpoints.Api ||
      reqSubPath !== Endpoints.Users ||
      id === '' ||
      urlArray.length > 3
    ) {
      sendInvalidUrlError(res);
    }

    // Get all users
    if (!res.writableEnded && method === 'GET' && !id) {
      const users = getAllUsers();

      sendDataInJSON(200, users, res);
    }

    // Get user by id
    if (!res.writableEnded && method === 'GET' && id) {
      const operationResult = getUserById(id);
      if (operationResult.isDone) {
        sendDataInJSON(operationResult.statusCode, operationResult.data, res);
      } else {
        sendError(operationResult.statusCode, operationResult.message, res);
      }
    }

  } catch {
    sendInternalServerError(res);
  }
});

server.listen(4000);
