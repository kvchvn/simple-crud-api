import { User } from './types.js';

export const ALL_USERS: User[] = [];

export const getAllUsers = () => ALL_USERS;

export const getUserById = (userId: string): User | undefined => {
  return ALL_USERS.find((user) => user.id === userId);
};

export const getUserIndexById = (userId: string) => {
  return ALL_USERS.findIndex((user) => user.id === userId);
};

export const createUser = (userData: User) => {
  ALL_USERS.push(userData);
};

export const updateUserByIndex = (userIndex: number, updatedUserData: User) => {
  ALL_USERS.splice(userIndex, 1, updatedUserData);
};

export const removeUserByIndex = (userIndex: number) => {
  ALL_USERS.splice(userIndex, 1);
};
