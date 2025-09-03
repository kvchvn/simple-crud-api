import { validate as uuidValidate } from 'uuid';

import { HttpError } from '../error';
import { EndpointHandler, StatusCodes } from '../types';
import { getUrlSegments, readDB } from '../utils';

export const getUsers: EndpointHandler = async (url) => {
  const segments = getUrlSegments(url);

  if (!segments.length) {
    return getAllUsers();
  } else {
    const userId = segments[0];
    return getUserById(userId);
  }
};

export const getAllUsers = async () => {
  const db = await readDB();
  return { data: db.users, status: StatusCodes.Ok };
};

export const getUserById = async (id: string | undefined) => {
  const isValidId = uuidValidate(id);

  if (!isValidId) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid userId');
  }

  const db = await readDB();

  const user = db.users.find((u) => u.id === id);

  if (!user) {
    throw new HttpError(StatusCodes.NotFound, 'User with such id is not found');
  }

  return { data: user, status: StatusCodes.Ok };
};
