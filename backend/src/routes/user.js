import express from 'express';
import cors from 'cors';
import Joi from 'joi';
import User from '../models/user';
import { SHA256 } from 'crypto-js';
import { randomBytes } from 'crypto';
import { hashSync } from 'bcryptjs';
import { signUp } from '../validations/user';
import { parseError, sessionizeUser, corsOptionsDelegate, addHeaders } from '../util/helpers';

const userRoutes = express.Router();

userRoutes.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.post('', async (req, res) => {
    addHeaders(req, res);

    try {
        const { username, email, password } = req.body;
        await Joi.validate({ email, password }, signUp);

        const salt = randomBytes(16).toString('base64');
        const auth = hashSync(email + password, `$2b$10$${SHA256(salt + email + password).toString().slice(-22)}`).slice(-50);

        const newUser = new User({ username, email, salt, auth });
        const sessionUser = sessionizeUser(newUser);
        await newUser.save();

        req.session.user = sessionUser;
        res.send(sessionUser);
    }
    catch(err) {
        res.status(400).send(parseError(err));
    }
});

export default userRoutes;