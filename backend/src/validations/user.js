import Joi from 'joi';

const email = Joi.string().required();
const password = Joi.string().required();
const username = Joi.string().required();

export const signUp = Joi.object().keys({
    email,
    username,
    password
});

export const signIn = Joi.object().keys({
    email,
    password
});

export const changeUsername = Joi.object().keys({
    username
});

export const changePassword = Joi.object().keys({
    email,
    old_password: password,
    new_password: password
});