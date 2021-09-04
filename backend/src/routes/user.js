import express from 'express';
import cors from 'cors';
import Joi from 'joi';
import mongo from 'mongodb';
import User from '../models/user';
import SessionsDAO from '../DAO/sessionsDAO';
import { signUp, signIn, changePassword, changeUsername } from '../validations/user';
import { parseError, sessionizeUser, corsOptionsDelegate, addHeaders, onRouteError, isAdmin, checkIfAdmin, generateSalt, generateAuth, isJSONPropDefined } from '../util/helpers';

const userRoutes = express.Router();

userRoutes.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/change-user-username', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/change-user-email', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/change-user-password', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/get-usernames', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/get-user-data', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/modify-user-data', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.options('/delete-user-data', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

userRoutes.post('', async (req, res) => {
    addHeaders(req, res);

    try {
        const { username, email, password, user_type } = req.body.user;
        await Joi.validate({ email, username, password }, signUp);

        const salt = await generateSalt();
        const auth = generateAuth(email, password, salt);

        const userData = {
            username,
            email,
            salt,
            auth,
            user_type
        };

        const newUser = new User(userData);
        const sessionUser = sessionizeUser(newUser);
        await newUser.save();

        req.session.user = sessionUser;
        res.send(sessionUser);
    }
    catch(err) {
        res.status(400).send(parseError(err));
    }
});

userRoutes.post('/change-user-username', async (req, res) => {
    addHeaders(req, res);

    try {
        const { userId, username } = req.body.user;
        const { userId: sessionUserId } = req.session.user;
        
        if (userId && sessionUserId && !userId.toString().localeCompare(sessionUserId.toString())) {
            await Joi.validate({ username }, changeUsername);

            const updatedUser = await User.findOneAndUpdate({ _id: mongo.ObjectID(userId) }, { $set: { username: username } }, { runValidators: true, useFindAndModify: false, returnOriginal: false });
            const sessionUser = sessionizeUser(updatedUser);
            req.session.user = sessionUser;

            res.status(200).send(sessionUser);
        }
        else {
            throw new Error('Invalid session');
        }
    }
    catch(err) {
        res.status(400).send(parseError(err));
    }
});

userRoutes.post('/change-user-email', async (req, res) => {
    addHeaders(req, res);

    try {
        const { userId, email, old_password, new_password } = req.body.user;
        const { userId: sessionUserId } = req.session.user;
        
        if (userId && sessionUserId && !userId.toString().localeCompare(sessionUserId.toString())) {
            await Joi.validate({ email, password: new_password }, signIn);

            const user = await User.findOne({ _id: mongo.ObjectID(userId) });
            if (user && user.comparePasswords(old_password)) {
                const salt = await generateSalt();
                const auth = generateAuth(email, new_password, salt);

                await User.updateOne({ _id: userId }, { $set: { email: email, salt: salt, auth: auth } }, { runValidators: true });
                res.status(200).send({});
            }
            else {
                throw new Error('Invalid login credentials');
            }
        }
        else {
            throw new Error('Invalid session');
        }
    }
    catch(err) {
        res.status(400).send(parseError(err));
    }
});

userRoutes.post('/change-user-password', async (req, res) => {
    addHeaders(req, res);

    try {
        if (!isJSONPropDefined(req, 'session.user')) {
            throw new Error('Invalid session');
        }

        const { userId, email, old_password, new_password } = req.body.user;
        const { userId: sessionUserId } = req.session.user;
        
        if (userId && sessionUserId && !userId.toString().localeCompare(sessionUserId.toString())) {
            await Joi.validate({ email, old_password, new_password }, changePassword);

            const user = await User.findOne({ _id: mongo.ObjectID(userId) });
            if (user && user.comparePasswords(old_password)) {
                const salt = await generateSalt();
                const auth = generateAuth(email, new_password, salt);

                await User.updateOne({ _id: userId }, { $set: { salt: salt, auth: auth } }, { runValidators: true });
                res.status(200).send({});
            }
            else {
                throw new Error('Invalid login credentials');
            }
        }
        else {
            throw new Error('Invalid session');
        }
    }
    catch(err) {
        res.status(400).send(parseError(err));
    }
});

userRoutes.get('/get-usernames', async (req, res) => {
    addHeaders(req, res);

    try {
        checkIfAdmin(isAdmin(req));

        const result = await User.find({}, 'username');
        res.status(200).send(result);
    }
    catch(err) {
        onRouteError(res, err, 'ERROR');
    }
});

userRoutes.post('/get-user-data', async (req, res) => {
    addHeaders(req, res);

    try {
        checkIfAdmin(isAdmin(req));

        const { _id } = req.body.user;

        const result = await User.findOne({ _id });
        res.status(200).send(result);
    }
    catch(err) {
        onRouteError(res, err, 'ERROR');
    }
});

userRoutes.post('/modify-user-data', async (req, res) => {
    addHeaders(req, res);

    try {
        checkIfAdmin(isAdmin(req));

        const { _id, userData } = req.body.user;

        await User.updateOne({ _id }, userData);

        const sessionizedUserData = sessionizeUser({ _id, ...userData });
        await SessionsDAO.updateUserSessions(_id, sessionizedUserData, isAdmin(req));

        res.status(200).send('OK');
    }
    catch(err) {
        onRouteError(res, err, 'ERROR');
    }
});

userRoutes.post('/delete-user-data', async (req, res) => {
    addHeaders(req, res);

    try {
        checkIfAdmin(isAdmin(req));

        const { _id } = req.body.user;

        await User.deleteOne({ _id });
        res.status(200).send('OK');
    }
    catch(err) {
        onRouteError(res, err, 'ERROR');
    }
});

export default userRoutes;