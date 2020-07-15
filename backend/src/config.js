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
    HOSTNAME_FOLDER_NAME,
    LOCAL_SSL,
    CORS_WHITELIST
} = process.env;