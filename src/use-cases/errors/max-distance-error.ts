export class MaxDistanceError extends Error {
  public code: number;

  constructor() {
    super('Max disance reached.');
    this.name = 'MaxDistanceError';
    this.code = 409;
  }
}
