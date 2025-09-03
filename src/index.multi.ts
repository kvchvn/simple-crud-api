import cluster, { type Worker } from 'node:cluster';
import http, { type RequestOptions } from 'node:http';
import os from 'node:os';
import process from 'node:process';

import dotenv from 'dotenv';
dotenv.config();

import { HttpError } from './error';
import { startSever } from './server';
import { StatusCodes } from './types';

const port = Number(process.env.PORT) || 4000;

const cpusCount = os.availableParallelism();

if (cluster.isPrimary) {
  let currentWorker = 0;
  const workers: { instance: Worker; port: number }[] = [];

  for (let i = 1; i <= cpusCount; i++) {
    const PORT = port + i;
    const worker = cluster.fork({ PORT });
    workers.push({ instance: worker, port: PORT });
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

  const server = http.createServer((req, res) => {
    try {
      const targetWorker = workers[currentWorker];
      currentWorker = currentWorker === workers.length - 1 ? 0 : currentWorker + 1;

      if (targetWorker) {
        const options: RequestOptions = {
          port: targetWorker.port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };

        const workerReq = http.request(options, (workerRes) => {
          res.setHeader('Content-Type', 'application/json');
          workerRes.pipe(res, { end: true });
        });

        req.pipe(workerReq, { end: true });
      }
    } catch (err) {
      console.log(err);

      if (err instanceof HttpError) {
        res.statusCode = err.statusCode;
        res.end(JSON.stringify({ error: err.message }));
      } else {
        const isErrorMessage = err && typeof err === 'object' && 'message' in err;

        res.statusCode = StatusCodes.ServerError;
        res.end(JSON.stringify({ error: isErrorMessage ? err.message : 'Unknown server error' }));
      }
    }
  });

  server.listen(port);
  console.log(`Server is listening on port ${port}`);
} else {
  const port = Number(process.env.PORT);

  if (port) {
    startSever(port);
  }
}
