declare namespace NodeJS {
  export interface ProcessEnv {
    PORT?: number;
    MONGODB_URI?: string;
    JWT_SECRET?: string;
    RATE_LIMIT_TTL?: number;
    RATE_LIMIT_LIMIT?: number;
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
    ENVIRONMENT: Environment;
  }
  export type Environment = 'DEVELOPMENT' | 'PRODUCTION' | 'STAGING';
}
