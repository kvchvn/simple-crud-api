import { validateFields } from './helpers.js';
import { BadResult, GoodResult, OperationResult, User } from './types.js';

const ALL_USERS: User[] = [
  {
    id: '0',
    username: 'Anton',
    age: 25,
    hobbies: ['films', 'football'],
  },
];

export const getAllUsers = () => ALL_USERS;

export const getUserById = (userId: string): OperationResult => {
  //TODO: check if id is valid
  const user = ALL_USERS.find((user) => user.id === userId);
  if (user) {
    return {
      isDone: true,
      statusCode: 200,
      data: user,
    };
  } else {
    return {
      isDone: false,
      statusCode: 404,
      message: `User with such id doesn't exist.`,
    };
  }
};

export const createUser = (userData: Omit<User, 'id'>): OperationResult => {
  const validation = validateFields(userData);

  if (validation.isDone) {
    //TODO: uuid
    const id = String(ALL_USERS.length);
    const { username, age, hobbies } = userData;
    const newUserData = { id, username, age, hobbies };
    ALL_USERS.push(newUserData);

    return {
      isDone: true,
      statusCode: 201,
      data: newUserData,
    };
  }

  return {
    isDone: false,
    statusCode: 400,
    message: validation.message,
  };
};

export const updateUserById = (userId: string, newUserData: Omit<User, 'id'>): OperationResult => {
  //TODO: check if id is valid
  //TODO: uuid
  const userIndex = ALL_USERS.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    const validation = validateFields(newUserData);

    if (validation.isDone) {
      const { username, age, hobbies } = newUserData;
      const updatedUserData = { id: userId, username, age, hobbies };
      ALL_USERS.splice(userIndex, 1, updatedUserData);

      return {
        isDone: true,
        statusCode: 200,
        data: updatedUserData,
      };
    } else {
      return {
        isDone: false,
        statusCode: 400,
        message: validation.message,
      };
    }
  }

  return {
    isDone: false,
    statusCode: 404,
    message: `User with such id doesn't exist.`,
  };
};

export const removeUserById = (userId: string): Omit<GoodResult, 'data'> | BadResult => {
  //TODO: check if id is valid
  const userIndex = ALL_USERS.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    ALL_USERS.splice(userIndex, 1);

    return {
      isDone: true,
      statusCode: 204,
    };
  } else {
    return {
      isDone: false,
      statusCode: 404,
      message: `User with such id doesn't exist.`,
    };
  }
};
