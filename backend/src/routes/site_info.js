import express from 'express';
import cors from 'cors';
import siteInfoDAO from '../DAO/siteInfoDAO';
import { corsOptionsDelegate, addHeaders, isAdmin, checkIfAdmin, onRouteError } from '../util/helpers';

const siteInfoRoutesAPI = express.Router();

siteInfoRoutesAPI.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

siteInfoRoutesAPI.options('/retrieve', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

siteInfoRoutesAPI.options('/set-update-date', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

siteInfoRoutesAPI.options('/set-marquee-text', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

siteInfoRoutesAPI.get('/retrieve', async (req, res) => {
    addHeaders(req, res);

    try {
        const result = await siteInfoDAO.retrieveSiteInfoData();
        res.status(200).send(result).end();
    }
    catch(e) {
        onRouteError(res, e, 'ERROR');
    }
});

siteInfoRoutesAPI.post('/set-update-date', async (req, res) => {
    addHeaders(req, res);

    try {
        checkIfAdmin(isAdmin(req));
        
        await siteInfoDAO.updateSiteUpdateDate(isAdmin(req));
        res.status(200).send({ ok: true }).end();
    }
    catch(e) {
        onRouteError(res, e, 'ERROR');
    }
});

siteInfoRoutesAPI.post('/set-marquee-text', async (req, res) => {
    addHeaders(req, res);

    try {
        checkIfAdmin(isAdmin(req));

        const marqueeText = req.body.marqueeText;
        
        await siteInfoDAO.updateSiteMarqueeText(marqueeText, isAdmin(req));
        res.status(200).send({ ok: true }).end();
    }
    catch(e) {
        onRouteError(res, e, 'ERROR');
    }
});

export const siteInfoRoutes = siteInfoRoutesAPI;
export const siteInfoDBComms = async (client, db) => await siteInfoDAO.injectDB(client, db);