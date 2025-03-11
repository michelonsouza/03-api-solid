export class LateCheckInValidationErrorError extends Error {
  public code: number;

  constructor() {
    super(
      'The check-in can only be validated until 20 minutes of its creation.',
    );
    this.name = 'LateCheckInValidationErrorError';
    this.code = 409;
  }
}
