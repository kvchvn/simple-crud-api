import process from 'node:process';

import dotenv from 'dotenv';
dotenv.config();

import { startSever } from './server';

const port = Number(process.env.PORT) || 8888;

startSever(port);
