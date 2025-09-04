import process from 'node:process';

export type User = { id: string; username: string; age: number; hobbies: string[] };

export type DbData = { users: User[] };

export const enum StatusCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  NotFound = 404,
  BadRequest = 400,
  ServerError = 500,
}

export const enum Methods {
  Post = 'POST',
  Get = 'GET',
  Put = 'PUT',
  Delete = 'DELETE',
}

export const doMethodExist = (method: unknown): method is Methods =>
  method === Methods.Post ||
  method === Methods.Get ||
  method === Methods.Put ||
  method === Methods.Delete;

export const isValidUrl = (url: unknown): url is string =>
  typeof url === 'string' && url.startsWith(process.env.BASE_URL as string);

export type EndpointHandler = (
  url: string,
  body?: unknown,
) => Promise<{ data: unknown; status: number }>;
export type Endpoints = Record<Methods, EndpointHandler>;

export const isValidUser = (user: unknown): user is User => {
  const isValidObject = user && typeof user === 'object';

  if (isValidObject) {
    const isValidUsernameField = 'username' in user && typeof user.username === 'string';
    const isValidAgeField = 'age' in user && typeof user.age === 'number';
    const isValidHobbiesField =
      'hobbies' in user &&
      typeof user.hobbies === 'object' &&
      Array.isArray(user.hobbies) &&
      !user.hobbies.filter((h) => typeof h !== 'string').length;

    return isValidUsernameField && isValidAgeField && isValidHobbiesField;
  }

  return false;
};
