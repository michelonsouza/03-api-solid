export class UserAlreadyExistsError extends Error {
  public code: number;

  constructor() {
    super('User already exists.');
    this.name = 'UserAlreadyExistsError';
    this.code = 409;
  }
}
