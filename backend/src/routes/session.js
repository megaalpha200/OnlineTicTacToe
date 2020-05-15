import express from 'express';
import cors from 'cors';
import Joi from 'joi';
import User from '../models/user';
import { signIn } from '../validations/user';
//import { AES } from 'crypto-js';
import { parseError, sessionizeUser, corsOptionsDelegate, addHeaders } from '../util/helpers';
import { SESSION_NAME } from '../config';

const sessionRouter = express.Router();

sessionRouter.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

sessionRouter.post('', async (req, res) => {
    addHeaders(req, res);

    try {
        const { email, password } = req.body;
        await Joi.validate({ email, password }, signIn);

        const user = await User.findOne({ email });
        if (user && user.comparePasswords(password)) {
            const sessionUser = sessionizeUser(user);

            req.session.user = sessionUser;
            res.send(sessionUser);
        }
        else {
            throw new Error('Invalid login credentials');
        }
    }
    catch (err) {
        res.status(401).send(parseError(err));
    }
});

sessionRouter.delete('', (req, res) => {
    addHeaders(req, res);

    const session = req.session;

    try {
        const user = session.user;
        if (user) {
            session.destroy(err => {
                if (err) throw (err);

                res.clearCookie(SESSION_NAME);
                res.send(user);
            });
        }
    }
    catch (err) {
        res.status(422).send(parseError(err));
    }
});

sessionRouter.get('', (req, res) => {
    addHeaders(req, res);

    const user = req.session.user;
    res.send({ user });
});

export default sessionRouter;