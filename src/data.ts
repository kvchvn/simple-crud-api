import { validateFields } from './helpers.js';
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
