import dotenv from 'dotenv';
import { createServer } from 'http';
import { sendInternalServerError, sendInvalidUrlError } from './helpers.js';
import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleRemoveUserById,
  handleUpdateUserById,
} from './requestHandlers.js';

dotenv.config();

const server = createServer();

const PORT = process.env.PORT || 4000;

server.on('request', (req, res) => {
  try {
    const { url, method } = req;
    const urlArray = url ? url.split('/').slice(1) : [''];
    const [reqPath, reqSubPath, id] = urlArray;

    // Invalid url
    if (reqPath !== 'api' || reqSubPath !== 'users' || id === '' || urlArray.length > 3) {
      sendInvalidUrlError(res);
    }

    // Get all users
    if (method === 'GET' && !id) {
      handleGetAllUsers(res);
    }

    // Get user by id
    if (method === 'GET' && id) {
      handleGetUserById(id, res);
    }

    // Create new user
    if (method === 'POST') {
      handleCreateUser(id, req, res);
    }

    // Update user
    if (method === 'PUT') {
      handleUpdateUserById(id, req, res);
    }

    // Remove user
    if (method === 'DELETE') {
      handleRemoveUserById(id, res);
    }
  } catch {
    sendInternalServerError(res);
  }
});

server.listen(PORT);
process.stdout.write(`\nServer is listening on http://localhost:${PORT}\n`);
