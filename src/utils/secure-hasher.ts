import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

export class SecureHasher {
  static readonly #SALT_LENGTH = 16; // Length of salt in bytes
  static readonly #HASH_LENGTH = 24; // Length of derived key in bytes
  static readonly #ITERATIONS = 100000; // Number of iterations
  static readonly #DIGEST: 'sha256' | 'sha512' = 'sha256'; // Secure hashing algorithm
  static readonly #SEPARATOR = ':'; // Separator for the stored hash

  /**
   * Generate a secure hash from a password
   * @param password - The password to hash
   * @returns The hashed password in the format: salt:iterations:hash
   */
  public static hash(password: string, saltLength = this.#SALT_LENGTH): string {
    const salt = randomBytes(saltLength).toString('hex');
    const hash = pbkdf2Sync(
      password,
      salt,
      this.#ITERATIONS,
      this.#HASH_LENGTH,
      this.#DIGEST,
    ).toString('hex');

    return `${salt}${this.#SEPARATOR}${this.#ITERATIONS}${this.#SEPARATOR}${hash}`;
  }

  /**
   * Compare a password with a stored hash
   * @param password - The password to check
   * @param storedHash - The stored hash from the database
   * @returns true if the password matches, otherwise false
   */
  public static compare(password: string, storedHash: string): boolean {
    const [salt, iterations, originalHash] = storedHash.split(this.#SEPARATOR);
    if (!salt || !iterations || !originalHash) return false;

    const computedHash = pbkdf2Sync(
      password,
      salt,
      parseInt(iterations),
      this.#HASH_LENGTH,
      this.#DIGEST,
    ).toString('hex');

    // Use timingSafeEqual to prevent timing attacks
    return timingSafeEqual(
      Buffer.from(computedHash, 'hex'),
      Buffer.from(originalHash, 'hex'),
    );
  }
}
