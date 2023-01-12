import dotenv from 'dotenv';
import { IS_MULTI_MODE, PORT } from './constants.js';
import runLoadBalancer from './loadBalancer.js';
import runServer from './server.js';

dotenv.config();

process.on('SIGINT', () => process.exit());

const server = runServer(PORT);

if (IS_MULTI_MODE) {
  runLoadBalancer();
}

export default server;
