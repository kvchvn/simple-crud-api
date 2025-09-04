import supertest from 'supertest';

import { startSever } from '../server';
import { isValidUser, User } from '../types';

const MOCK_USER: Omit<User, 'id'> = {
  username: 'Test user',
  age: 20,
  hobbies: ['Soccer', 'Books'],
};

describe('Test server', () => {
  const port = 4000;
  const server = startSever(port);
  const request = supertest(server);
  let userId = '';

  afterAll(() => {
    server.close();
  });

  test('Request unavailable endpoint', async () => {
    const res = await request.get('/smth-unreachable');

    expect(res.status).toBe(404);
    expect('error' in res.body).toBeTruthy();
  });

  test('Get all users', async () => {
    const res = await request.get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/json');
    expect(res.body).toStrictEqual({ data: [] });
  });

  test('Create new user', async () => {
    const res = await request.post('/api/users').send(MOCK_USER);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = res.body?.data as User;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isUser = isValidUser(res.body?.data);

    userId = user?.id ?? '';

    expect(res.statusCode).toBe(201);

    expect(isUser).toBeTruthy();
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe(MOCK_USER.username);
  });

  test('Get user by id', async () => {
    const res = await request.get(`/api/users/${userId}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = res.body?.data as User;

    expect(res.statusCode).toBe(200);
    expect(user).toBeDefined();
    expect(user.id).toBe(userId);
    expect(user.username).toBe(MOCK_USER.username);
  });

  test('Update the user', async () => {
    const newUsername = 'New username';
    const newAge = 30;
    const res = await request
      .put(`/api/users/${userId}`)
      .send({ ...MOCK_USER, username: newUsername, age: newAge });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = res.body?.data as User;

    expect(res.statusCode).toBe(200);

    expect(user).toBeDefined();
    expect(user.id).toBe(userId);
    expect(user.username).toBe(newUsername);
    expect(user.age).toBe(newAge);
  });

  test('Remove the user', async () => {
    const res = await request.delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(204);
  });

  test('Get all users again', async () => {
    const res = await request.get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ data: [] });
  });
});
