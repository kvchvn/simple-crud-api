import { Endpoints, Methods } from '../types';
import { createUser, deleteUser, updateUser } from './mutations';
import { getUsers } from './queries';

export const endpoints: Partial<Endpoints> = {
  [Methods.Get]: getUsers,
  [Methods.Post]: createUser,
  [Methods.Put]: updateUser,
  [Methods.Delete]: deleteUser,
};
