import bcrypt from 'bcryptjs';
import { IHashProvider } from '@application/interfaces/providers/IHashProvider';
import { env } from '@infrastructure/config/env';

export class BcryptHashProvider implements IHashProvider {
  async hash(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(plainText, salt);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
