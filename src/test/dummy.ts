import { User } from '../types.js';

export const dummyUser: Omit<User, 'id'> = {
  username: 'John',
  age: 50,
  hobbies: ['soccer'],
};
