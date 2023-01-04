import { BadResult, GoodResult, User } from './types.js';

export const validateFields = (
  userData: Record<string, unknown>
): Pick<GoodResult, 'isDone'> | Pick<BadResult, 'isDone' | 'message'> => {
  if (!('username' in userData) || !('age' in userData) || !('hobbies' in userData)) {
    return {
      isDone: false,
      message: 'These fields are required: username, age, hobbies.',
    };
  }
  if (typeof userData.username !== 'string') {
    return {
      isDone: false,
      message: `Field 'username' should be string.`,
    };
  }
  if (typeof userData.age !== 'number') {
    return {
      isDone: false,
      message: `Field 'age' should be number.`,
    };
  }
  if (
    !Array.isArray(userData.hobbies) ||
    !userData.hobbies.every((item) => typeof item === 'string')
  ) {
    return {
      isDone: false,
      message: `Field 'hobbies' should be array of strings`,
    };
  }
  return {
    isDone: true,
  };
};
