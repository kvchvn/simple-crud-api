import http from 'node:http';

import { HttpError } from './error';
import { endpoints } from './handlers/endpoints';
import { doMethodExist, isValidUrl, StatusCodes } from './types';
import { readRequestBody } from './utils';

export const startSever = (port: number) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = http.createServer(async (req, res) => {
    try {
      const { url, method } = req;
      res.setHeader('Content-Type', 'application/json');

      if (doMethodExist(method) && isValidUrl(url) && endpoints[method]) {
        const body = await readRequestBody(req);
        const { data, status } = await endpoints[method](url, body);

        res.statusCode = status;
        res.end(JSON.stringify({ data }));
      } else {
        throw new HttpError(StatusCodes.NotFound, 'Not found such API endpoint');
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

  return server;
};
