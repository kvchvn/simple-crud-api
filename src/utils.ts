import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { HttpError } from './error';
import { DbData, StatusCodes } from './types';

const dbPath = path.resolve('src/db.json');

export const readDB = () =>
  new Promise<DbData>((resolve, reject) => {
    const rs = fs.createReadStream(dbPath, { encoding: 'utf8' });

    let dataString = '';

    rs.on('data', (chunk) => {
      if (typeof chunk === 'string') {
        dataString += chunk;
      }
    });

    rs.on('end', () => {
      try {
        const data = JSON.parse(dataString) as DbData;
        resolve(data);
      } catch (err) {
        console.log(err);
        reject(new HttpError(StatusCodes.ServerError, 'Failed parsing database data'));
      }
    });

    rs.on('error', (err) => {
      console.log(err);
      reject(new HttpError(StatusCodes.ServerError, 'Failed accessing database'));
    });
  });

export const writeDB = async (data: DbData) =>
  new Promise<DbData>((resolve, reject) => {
    const ws = fs.createWriteStream(dbPath, { encoding: 'utf8' });

    ws.on('close', () => {
      resolve(data);
    });

    ws.on('error', (err) => {
      console.log(err);
      reject(new HttpError(StatusCodes.ServerError, 'Failed writing to database.'));
    });

    ws.write(JSON.stringify(data), (err) => {
      if (!err) {
        ws.close();
      }
    });
  });

export const readRequestBody = (req: http.IncomingMessage) =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: unknown) => {
      body += chunk?.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody: unknown = JSON.parse(body);
        resolve(parsedBody);
      } catch {
        resolve(undefined);
      }
    });

    req.on('error', () => {
      reject(new HttpError(StatusCodes.ServerError, 'Failed to read request body'));
    });
  });

export const getUrlSegments = (url: string) => {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error('BASE_URL must be a string');
  }

  if (url === baseUrl) {
    return [];
  }

  if (!url.startsWith(`${baseUrl}/`)) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid endpoint');
  }

  const [segmentsString] = url.split(`${baseUrl}/`).filter(Boolean);

  if (!segmentsString) {
    return [];
  }

  return segmentsString.split('/').filter(Boolean);
};
