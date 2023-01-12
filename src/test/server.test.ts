import supertest from 'supertest';
import { ALL_USERS } from '../data.js';
import server from '../index.js';
import { dummyUser } from './dummy.js';

describe('Server testing', () => {
  const request = supertest(server);
  afterEach(() => {
    server.close();
    ALL_USERS.splice(0, ALL_USERS.length);
  });

  test('Request to invalid endpoint', async () => {
    const response = await request.get('/blablabla');

    expect(response.statusCode).toBe(404);
  });

  test('Get all users for the first time', async () => {
    const { statusCode, body } = await request.get('/api/users');

    expect(statusCode).toBe(200);
    expect(body.data.length).toBe(0);
  });

  test('Create and get by id a user', async () => {
    const { statusCode: createUserStatusCode, body: createUserBody } = await request
      .post('/api/users')
      .send(dummyUser);
    const { id: userId } = createUserBody.data;
    const { statusCode: getUserByIdStatusCode, body: getUserByIdBody } = await request.get(
      `/api/users/${userId}`
    );

    // checking user creating
    expect(createUserStatusCode).toBe(201);
    expect(createUserBody.data.username).toBe(dummyUser.username);
    expect(ALL_USERS.length).toBe(1);

    // checking user getting by id
    expect(getUserByIdStatusCode).toBe(200);
    expect(getUserByIdBody.data.id).toBe(userId);
  });

  test('Create and update a user', async () => {
    const updatedUsername = 'Tony';
    const { body: createUserBody } = await request.post('/api/users').send(dummyUser);
    const { id: userId } = createUserBody.data;
    const { statusCode, body: updateUserBody } = await request
      .put(`/api/users/${userId}`)
      .send({ ...dummyUser, username: updatedUsername });

    expect(statusCode).toBe(200);
    expect(updateUserBody.data.username).toBe(updatedUsername);
    expect(updateUserBody.data.id).toBe(userId);
  });

  test('Create and delete a user', async () => {
    const { body: createUserBody } = await request.post('/api/users').send(dummyUser);
    const { id: userId } = createUserBody.data;
    const { statusCode } = await request.delete(`/api/users/${userId}`);

    expect(statusCode).toBe(204);
    expect(ALL_USERS.length).toBe(0);
  });

  test('Create a user with invalid body', async () => {
    const { statusCode } = await request.post('/api/users').send({ username: 'Tom' });

    expect(statusCode).toBe(400);
  });

  test('Create a user and try to get the user by wrong/invalid id', async () => {
    const { body: createUserBody } = await request.post('/api/users').send(dummyUser);
    const { id: userId } = createUserBody.data;
    const wrongUserId = `A${userId.slice(1)}`;
    const invalidUserId = userId.slice(1);
    const { statusCode: getUserByRightIdStatusCode } = await request.get(`/api/users/${userId}`);
    const { statusCode: getUserByWrongIdStatusCode } = await request.get(
      `/api/users/${wrongUserId}`
    );
    const { statusCode: getUserByInvalidIdStatusCode } = await request.get(
      `/api/users/${invalidUserId}`
    );

    expect(getUserByRightIdStatusCode).toBe(200);
    expect(getUserByWrongIdStatusCode).toBe(404);
    expect(getUserByInvalidIdStatusCode).toBe(400);
  });
});
