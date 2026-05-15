// Global type declarations
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: 'development' | 'production' | 'test';
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    BCRYPT_SALT_ROUNDS: string;
  }
}
