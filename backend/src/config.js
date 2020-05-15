import dotenv from 'dotenv';

dotenv.config();

export const {
    PORT,
    MONGODB_URI,
    MONGODB_DATABASE_NAME,
    SESSION_NAME,
    SESSION_SECRET,
    SESSION_TTL,
    NODE_ENV,
    CORS_WHITELIST
} = process.env;