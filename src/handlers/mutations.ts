import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

import { HttpError } from '../error';
import { EndpointHandler, isValidUser, StatusCodes, type User } from '../types';
import { getUrlSegments, readDB, writeDB } from '../utils';

export const createUser: EndpointHandler = async (url, body) => {
  const segments = getUrlSegments(url);

  if (segments.length) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid endpoint');
  }

  if (!isValidUser(body)) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid body of request');
  }

  const db = await readDB();

  const newUser: User = {
    id: uuidV4(),
    username: body.username,
    age: body.age,
    hobbies: body.hobbies,
  };

  await writeDB({ users: db.users.concat(newUser) });

  return { data: newUser, status: StatusCodes.Created };
};

export const updateUser: EndpointHandler = async (url, body) => {
  const [userId] = getUrlSegments(url);
  const isValidUserId = uuidValidate(userId);

  if (!isValidUserId) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid userId');
  }

  if (!isValidUser(body)) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid body of request');
  }

  const db = await readDB();
  const userIndex = db.users.findIndex((u) => u.id === userId);
  const user = db.users[userIndex];

  if (!user) {
    throw new HttpError(StatusCodes.NotFound, 'User with such id is not found');
  }

  const updatedUser: User = {
    id: user.id,
    username: body.username,
    age: body.age,
    hobbies: body.hobbies,
  };

  await writeDB({
    users: db.users
      .slice(0, userIndex)
      .concat(updatedUser)
      .concat(db.users.slice(userIndex + 1)),
  });

  return { data: updatedUser, status: StatusCodes.Ok };
};

export const deleteUser: EndpointHandler = async (url) => {
  const [userId] = getUrlSegments(url);
  const isValidUserId = uuidValidate(userId);

  if (!isValidUserId) {
    throw new HttpError(StatusCodes.BadRequest, 'Invalid userId');
  }

  const db = await readDB();

  const userIndex = db.users.findIndex((u) => u.id === userId);
  const user = db.users[userIndex];

  if (!user) {
    throw new HttpError(StatusCodes.NotFound, 'User with such id is not found');
  }

  await writeDB({ users: db.users.slice(0, userIndex).concat(db.users.slice(userIndex + 1)) });

  return { data: user, status: StatusCodes.NoContent };
};
