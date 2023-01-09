import cluster from 'cluster';
import { cpus } from 'os';
import { PORT } from './constants.js';
import { ALL_USERS } from './data.js';
import { shareDataToWorkers } from './helpers.js';
import { User } from './types.js';

const forkCluster = () => {
  cpus().forEach((_, index) => {
    const WORKER_PORT = PORT + 1 + index;
    cluster.fork({ PORT: WORKER_PORT });
  });
};

const runLoadBalancer = () => {
  if (cluster.isPrimary) {
    forkCluster();

    cluster.on('message', (_, data) => {
      ALL_USERS.splice(0, ALL_USERS.length, ...data);
      shareDataToWorkers(ALL_USERS);
    });
  }

  if (cluster.isWorker) {
    process.on('message', (data: User[]) => {
      ALL_USERS.splice(0, ALL_USERS.length, ...data);
    });
  }
};

export default runLoadBalancer;
