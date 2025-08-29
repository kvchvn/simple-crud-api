import process from 'node:process';

export type User = { id: string; username: string; age: number; hobbies: string[] };

export type DbData = { users: User[] };

export const enum StatusCodes {
  Ok = 200,
  NotFound = 404,
  BadRequest = 400,
  ServerError = 500,
}

export const enum Methods {
  Post = 'POST',
  Get = 'GET',
}

export const doMethodExist = (method: unknown): method is Methods =>
  method === Methods.Post || method === Methods.Get;

export const isValidUrl = (url: unknown): url is string =>
  typeof url === 'string' && url.startsWith(process.env.BASE_URL as string);
