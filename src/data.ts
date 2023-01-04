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
