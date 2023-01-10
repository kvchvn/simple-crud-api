import cluster from 'cluster';
import { createServer } from 'http';
import { cpus } from 'os';
import { BASE_PROTOCOL_WITH_HOSTNAME, IS_MULTI_MODE, PORT, REQUEST } from './constants.js';
import { ALL_USERS } from './data.js';
import {
  sendInternalServerError,
  sendInvalidEndpointError,
  shareDataToWorkers,
} from './helpers.js';
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
        sendInvalidEndpointError(res);
      }

      if (IS_MULTI_MODE) {
        if (cluster.isPrimary && cluster.workers) {
          const redirectedPort = PORT + portIndex;
          const redirectedLocation = `${BASE_PROTOCOL_WITH_HOSTNAME}:${redirectedPort}${url}`;

          const workers = Object.values(cluster.workers);
          const workerByPort = workers.find((worker) => {
            if (worker) {
              return worker.id === redirectedPort;
            }
          });
          if (workerByPort) {
            workerByPort.send({ isRedirectedRequest: true });
          }

          if (portIndex === cpus().length) {
            portIndex = INITIAL_PORT_INDEX;
          } else {
            portIndex += 1;
          }

          res.writeHead(307, { location: redirectedLocation });
          res.end();
        }

        if (cluster.isWorker) {
          if (REQUEST.isRedirected) {
            REQUEST.isRedirected = false;
          } else {
            req.destroy();
          }
        }
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

      res.on('close', () => {
        if (IS_MULTI_MODE) {
          // sync ALL_USERS between main process and all the workers
          if (cluster.isPrimary) {
            shareDataToWorkers(ALL_USERS);
          }

          if (cluster.isWorker) {
            if (process.send) {
              process.send(ALL_USERS);
            }
          }
        }
      });
    } catch {
      sendInternalServerError(res);
    }
  });

  server.listen(port);

  return server;
};

export default runServer;
