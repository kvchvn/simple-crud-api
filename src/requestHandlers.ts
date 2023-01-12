import { IncomingMessage, ServerResponse } from 'http';
import { v4 as generateUUID, validate } from 'uuid';
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserIndexById,
  removeUserByIndex,
  updateUserByIndex,
} from './data.js';
import {
  sendDataInJSON,
  sendError,
  sendInvalidBodyError,
  sendInvalidEndpointError,
  sendInvalidIdError,
  sendUserDoesNotExistError,
  validateFields,
} from './helpers.js';

export const handleGetAllUsers = (res: ServerResponse) => {
  if (res.writableEnded) return;

  const users = getAllUsers();
  sendDataInJSON(200, users, res);
};

export const handleGetUserById = (id: string, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (!validate(id)) {
    sendInvalidIdError(res);
    return;
  }

  const user = getUserById(id);
  if (user) {
    sendDataInJSON(200, user, res);
  } else {
    sendUserDoesNotExistError(res);
  }
};

export const handleCreateUser = (id: string, req: IncomingMessage, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (id) {
    sendInvalidEndpointError(res);
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedUserData = JSON.parse(body);
      const validation = validateFields(parsedUserData);

      if (validation.isSuccess) {
        const id = generateUUID();
        const { username, age, hobbies } = parsedUserData;
        const userData = { id, username, age, hobbies };
        createUser(userData);

        sendDataInJSON(201, userData, res);
      } else {
        sendError(400, validation.message, res);
      }
    } catch {
      sendInvalidBodyError(res);
    }
  });
};

export const handleUpdateUserById = (id: string, req: IncomingMessage, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (!id) {
    sendInvalidEndpointError(res);
    return;
  }

  if (!validate(id)) {
    sendInvalidIdError(res);
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const parsedUserData = JSON.parse(body);
      const userIndex = getUserIndexById(id);

      if (userIndex !== -1) {
        const validation = validateFields(parsedUserData);

        if (validation.isSuccess) {
          const { username, age, hobbies } = parsedUserData;
          const updatedUserData = { id, username, age, hobbies };
          updateUserByIndex(userIndex, updatedUserData);

          sendDataInJSON(200, updatedUserData, res);
        } else {
          sendError(400, validation.message, res);
        }
      } else {
        sendUserDoesNotExistError(res);
      }
    } catch {
      sendInvalidBodyError(res);
    }
  });
};

export const handleRemoveUserById = (id: string, res: ServerResponse) => {
  if (res.writableEnded) return;

  if (!id) {
    sendInvalidEndpointError(res);
    return;
  }

  if (!validate(id)) {
    sendInvalidIdError(res);
    return;
  }

  const userIndex = getUserIndexById(id);

  if (userIndex !== -1) {
    removeUserByIndex(userIndex);
    sendDataInJSON(204, null, res);
  } else {
    sendUserDoesNotExistError(res);
  }
};
