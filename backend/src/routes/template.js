import express from 'express';
import cors from 'cors';
import templateDAO from '../DAO/templateDAO';
import { corsOptionsDelegate, addHeaders } from '../util/helpers';

const templateRoutesAPI = express.Router();

templateRoutesAPI.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

templateRoutesAPI.options('/send', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

templateRoutesAPI.options('/retrieve', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

templateRoutesAPI.post('/send', async (req, res) => {
    addHeaders(req, res);

    await templateDAO.sendTestData(req.body);
    res.status(200).send('OK').end();
});

templateRoutesAPI.post('/retrieve', async (req, res) => {
    addHeaders(req, res);

    const result = await templateDAO.retrieveTestData(req.body._id);
    res.status(200).send(result).end();
});

export const templateRoutes = templateRoutesAPI;
export const templateDBComms = async (client, db) => await templateDAO.injectDB(client, db);