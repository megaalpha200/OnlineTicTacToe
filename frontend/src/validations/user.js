import Joi from 'joi';

const email = Joi.string().email().required();

const usernameMessage = 'must be between 4-20 alphanumeric characters, optionally including a dot (.) ' +
    'and cannot include !, @, #, $, %, ^, &, *, or any special characters, or end with a dot (.)';

const username = Joi.string().regex(/^([A-Za-z]+\d*)([.]*[A-Za-z]+\d*)$/).min(4).max(20)
    .required()
    .options({
        language: {
            string: {
                regex: {
                    base: usernameMessage
                }
            }
        }
    });

const passwordMessage = 'must be between 8-30 characters, ' +
    'have at least one capital letter, ' +
    'one lowercase letter, one digit, ' +
    'and one special character';

const password = Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/)
    .options({
        language: {
            string: {
                regex: {
                    base: passwordMessage
                }
            }
        }
    });

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
    old_password: password,
    new_password: password
});