import dotenv from 'dotenv';
import runServer from './server.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

process.on('SIGINT', () => process.exit());

const server = runServer(PORT);

process.stdout.write(`\nServer is listening on http://localhost:${PORT}\n`);

export default server;
