import { validate as uuidValidate } from 'uuid';

import { HttpError } from '../error';
import { StatusCodes } from '../types';
import { getUrlSegments, readDB } from '../utils';

export const getUsers = async (url: string) => {
  const segments = getUrlSegments(url);

  if (!segments.length) {
    return getAllUsers();
  } else {
    const userId = segments[0];
    return getUserById(userId);
  }
};

export const getAllUsers = async () => {
  const data = await readDB();
  return data.users;
};

export const getUserById = async (id: string | undefined) => {
  const isValidId = uuidValidate(id);

  if (!isValidId) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid userId');
  }

  const data = await readDB();

  const user = data.users.find((u) => u.id === id);

  if (!user) {
    throw new HttpError(StatusCodes.NotFound, 'User with such id is not found');
  }

  return user;
};
