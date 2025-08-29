import { Methods } from '../types';
import { getUsers } from './queries';

type Endpoints = Record<Methods, (url: string, body?: unknown) => Promise<unknown>>;

export const endpoints: Partial<Endpoints> = { GET: getUsers };
