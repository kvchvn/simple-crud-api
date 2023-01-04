import { createServer } from 'http';
import { createUser, getAllUsers, getUserById, removeUserById, updateUserById } from './data.js';
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

    // Create new user
    if (!res.writableEnded && method === 'POST') {
      if (id) {
        sendInvalidUrlError(res);
      } else {
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
      }
    }

    // Update user
    if (!res.writableEnded && method === 'PUT') {
      if (!id) {
        sendInvalidUrlError(res);
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
    }

    // Remove user
    if (!res.writableEnded && method === 'DELETE') {
      if (!id) {
        sendInvalidUrlError(res);
      }
      const operationResult = removeUserById(id);

      if (operationResult.isDone) {
        sendDataInJSON(operationResult.statusCode, null, res);
      } else {
        sendError(operationResult.statusCode, operationResult.message, res);
      }
    }
  } catch {
    sendInternalServerError(res);
  }
});

server.listen(4000);
