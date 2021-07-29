import { CORS_WHITELIST } from '../config';
import { SHA256 } from 'crypto-js';
import { randomBytes } from 'crypto';
import { hashSync } from 'bcryptjs';
import User from '../models/user';

const whitelist = CORS_WHITELIST.split(',');

export const sessionizeUser = user => ({ 
  userId: user._id, 
  username: user.username,
  user_type: user.user_type
});

export const isJSONPropDefined = (target, path) => {
  if (typeof target != 'object' || target == null) {
      return false;
  }

  var parts = path.split('.');

  while(parts.length) {
      var branch = parts.shift();
      if (!(branch in target)) {
          return false;
      }

      target = target[branch];
  }

  return true;
}

export const isAdmin = req => {
  return isJSONPropDefined(req, 'session.user.user_type') && req.session.user.user_type === 'true_admin';
}

export const checkIfAdmin = (isAdmin) => {
  if (!isAdmin) throw Error('Access Denied!');
  return;
}

export const logMessage = msg => {
  console.log(`${new Date().getTime()} - ${msg}`);
}

export const onRouteError = (res, e, err500) => {
  console.log(e.message);
  if (e.errmsg && e.errmsg.includes("E11000")) {
    res.status(409).send(e.errmsg).end();
  }
  else if (e.message.includes('Access Denied!')) {
    res.status(403).send('Access Denied!').end();
  }
  else if (e.message.includes('Not Found!') || e.message.includes('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) {
    res.status(404).send('Not Found!').end();
  }
  else {
    res.status(500).send(err500).end();
  }
}

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

export const generateSalt = async (iteration = 0) => {
  const generatedSalt = randomBytes(16).toString('base64');

  try {
    if (iteration === 10) {
      throw new Error('Something has gone wrong! Please try again at a later time.');
    }
    else {
      const newUser = {
        username: '●●●●●●●●●●●●●●●●●●●●',
        email: 'test@test.co',
        salt: generatedSalt,
        auth: '0000000000',
        user_type: 'basic'
      };

      await User.validate(newUser);
      return generatedSalt;
    }
  }
  catch(err) {
    if (err.message.includes('Salt already exists')) {
      return (await generateSalt(user, iteration + 1));
    }
    else {
      throw err;
    }
  }
}

export const generateAuth = (email, password, salt) => hashSync(email + password, `$2b$10$${SHA256(salt + email + password).toString().slice(-22)}`).slice(-50);