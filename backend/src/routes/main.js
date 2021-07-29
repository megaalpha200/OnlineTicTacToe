import express from 'express';
import cors from 'cors';
import { corsOptionsDelegate, addHeaders, isAdmin } from '../util/helpers';

const mainRoutes = express.Router();

mainRoutes.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

mainRoutes.get('', async (req, res) => {
    addHeaders(req, res);

    if (isAdmin(req)) {
        res.status(200).send('API').end();
    }
    else {
        res.status(302).redirect('/');
    }
});

export default mainRoutes;