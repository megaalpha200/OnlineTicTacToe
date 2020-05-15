import Joi from 'joi';

const email = Joi.string().required();
const password = Joi.string().required();

export const signUp = Joi.object().keys({
    email,
    password
});

export const signIn = Joi.object().keys({
    email,
    password
});