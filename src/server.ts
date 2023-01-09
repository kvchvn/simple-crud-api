import cluster from 'cluster';
import { createServer } from 'http';
import { cpus } from 'os';
import { BASE_PROTOCOL_WITH_HOSTNAME, IS_MULTI_MODE, PORT } from './constants.js';
import { ALL_USERS } from './data.js';
import { sendInternalServerError, sendInvalidUrlError, shareDataToWorkers } from './helpers.js';
import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleRemoveUserById,
  handleUpdateUserById,
} from './requestHandlers.js';

const runServer = (port: number) => {
  const INITIAL_PORT_INDEX = 1;
  let portIndex = INITIAL_PORT_INDEX;
  const server = createServer();

  server.on('request', (req, res) => {
    try {
      const { url, method } = req;
      const urlArray = url ? url.split('/').slice(1) : [''];
      const [reqPath, reqSubPath, id] = urlArray;

      // Invalid url
      if (reqPath !== 'api' || reqSubPath !== 'users' || id === '' || urlArray.length > 3) {
        sendInvalidUrlError(res);
      }

      if (IS_MULTI_MODE && cluster.isPrimary) {
        const redirectedPort = PORT + portIndex;
        const redirectedLocation = `${BASE_PROTOCOL_WITH_HOSTNAME}:${redirectedPort}${url}`;

        if (portIndex === cpus().length) {
          portIndex = INITIAL_PORT_INDEX;
        } else {
          portIndex += 1;
        }
        res.writeHead(307, { location: redirectedLocation });
        res.end();
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

  server.listen(port);

  return server;
};

export default runServer;
