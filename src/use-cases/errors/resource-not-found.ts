export class ResourceNotFoundError extends Error {
  public code: number;

  constructor(resource = 'Resource') {
    super(`${resource} not found.`);
    this.name = 'ResourceNotFoundError';
    this.code = 404;
  }
}
