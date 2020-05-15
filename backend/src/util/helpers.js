import { CORS_WHITELIST } from '../config';

const whitelist = CORS_WHITELIST.split(',');

export const sessionizeUser = user => {
    return { 
      userId: user.id, 
      username: user.username
    };
  };

export const corsOptionsDelegate = (req, callback) => {
  const whitelistIndex = whitelist.indexOf(req.header('Origin'));

  let corsOptions = { credentials: true };

  if (whitelistIndex !== -1) {
    corsOptions.origin = whitelist[whitelistIndex];
  }
  else {
    corsOptions.origin = false;
  }

  if (callback) {
    callback(null, corsOptions);
  }
  else {
    return corsOptions;
  }
};

export const addHeaders = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', corsOptionsDelegate(req, null).origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

export const parseError = err => {
    if (err.isJoi) return err.details[0];
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
};