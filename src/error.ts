export class HttpError extends Error {
  public statusCode: number;
  public name: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}
