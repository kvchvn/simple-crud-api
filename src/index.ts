import dotenv from 'dotenv';
import runServer from './server.js';

dotenv.config();

process.on('SIGINT', () => process.exit());

const server = runServer(PORT);

process.stdout.write(`\nServer is listening on http://localhost:${PORT}\n`);

export default server;
