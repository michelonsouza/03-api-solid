export class MaxNumberOfCheckInsError extends Error {
  public code: number;

  constructor() {
    super('Max number of check-ins reached.');
    this.name = 'MaxNumberOfCheckInsError';
    this.code = 409;
  }
}
