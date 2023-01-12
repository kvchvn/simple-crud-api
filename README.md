## Simple CRUD API

---

Description of the task [see here](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md).

---

#### Commands for running the application (via `npm`):

* `npm run start:dev` - run in development mode (using `nodemon`, `ts-node`);
* `npm run start:prod` - build a bundle (using `webpack`) and run in production mode;
* `npm run start:multi` - build bundle and turn on horizontal scaling for the app (using `cluster` api);
* `npm run start:multi-dev` - the same as previous script except for building a bundle (running with `nodemon`);
* `npm run test`- run tests (using`jest`, `supertest`).

There is also _.env.example_ file in root directory with example of how should look your _.env_ file.

If you don't create _.env_, port will be set 4000 by default.

#### User model:

```
{
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
```

#### Available endpoints:

* **GET** `api/users` - get array of all users;
* **GET** `api/users/${userId}` - get object with user data by id;
* **POST** `api/users` - create new user **(*)**;
* **PUT** `api/users/${userId}` - update user data by id **(*)**;
* **DELETE** `api/users/${userId}` - delete user by id.

  > **(*)** - object with _username_, _age_, _hobbies_ must be passed in body. Unique _id_ is assigned automatically.
  >

#### Clarification:

* endpoint `api/users/` is considered invalid (`api/users` is expected);
* excess properties (all except _username_, _age_, _hobbies_) are ignored in **POST**, **PUT** requests;
* you must pass **all** required properties in **POST**, **PUT** requests, otherwise an error will be received.
