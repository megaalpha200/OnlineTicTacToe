import express from 'express';
import cors from 'cors';
import { parseError, corsOptionsDelegate, addHeaders, isAdmin, checkIfAdmin, onRouteError } from '../util/helpers';
import gameDAO from '../DAO/gameSessionDAO';
import { SESSION_NAME } from '../config';

const gameRouterAPI = express.Router();

gameRouterAPI.options('', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

gameRouterAPI.options('/clear-game-sessions', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

gameRouterAPI.post('', async (req, res) => {
    addHeaders(req, res);

    try {
        // var gameData = {};

        // console.log(req.body.gameData.session_id);
        // if (!req.body.gameData.session_id) {
        //     if (!req.session.gameData || !req.session.gameData.assignedPlayer) {
        //         gameData = {
        //             assignedPlayer: 1
        //         };
        //     }

        //     gameData = {
        //         ...gameData,
        //         ...req.body.gameData,
        //         session_id: req.sessionID
        //     };
        // }
        // else {
        //     gameData = {
        //         assignedPlayer: 2,
        //         session_id: req.body.gameData.session_id
        //     };

        //     gameData = {
        //         ...gameData,
        //         ...req.body.gameData
        //     };
        // }

        // req.session.gameData = gameData;
        // res.send(gameData);
        // console.log(req.sessionID);
        // console.log(req);

        req.session.session_id = req.body.session_id;
        
        if (req.body.assignedPlayer) {
            req.session.assignedPlayer = req.body.assignedPlayer;
        }

        res.send({});
    }
    catch (err) {
        res.status(500).send(parseError(err));
    }
});

gameRouterAPI.delete('', (req, res) => {
    addHeaders(req, res);

    const session = req.session;

    try {
        const session_id = session.session_id;

        if (session_id) {
            gameDAO.deleteGameData(session_id);
            session.destroy(err => {
                if (err) throw (err);
                res.clearCookie(SESSION_NAME);
                res.send();
            });
        }
    }
    catch (err) {
        res.status(422).send(parseError(err));
    }
});

gameRouterAPI.get('', async (req, res) => {
    addHeaders(req, res);

    try {
        const session_id = req.session.session_id;
        const gameData = await gameDAO.retrieveGameData(session_id);
        
        if (gameData) {
            gameData.assignedPlayer = req.session.assignedPlayer;
        }

        res.send({ gameData });
    }
    catch(err) {
        res.status(404).send(parseError(err));
    }
});

gameRouterAPI.delete('/clear-game-sessions', (req, res) => {
    addHeaders(req, res);

    const session = req.session;

    try {
        checkIfAdmin(isAdmin(req));

        const session_id = session.session_id;

        gameDAO.clearGameSessions(isAdmin(req));

        if (session_id) {
            delete req.session.session_id;
            delete req.session.assignedPlayer;
        }

        res.status(200).send('OK').end();
    }
    catch (err) {
        onRouteError(res, err, 'ERROR');
    }
});

export const gameRoutes = gameRouterAPI;
export const gameDBComms = async (client, db) => await gameDAO.injectDB(client, db);