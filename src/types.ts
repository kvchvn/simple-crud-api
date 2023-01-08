export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface GoodResult {
  isDone: true;
  statusCode: number;
  data: User;
}

export interface BadResult {
  isDone: false;
  statusCode: number;
  message: string;
}

export type OperationResult = GoodResult | BadResult;
