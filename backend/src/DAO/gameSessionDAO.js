var mongo = require('mongodb');
var checkIfAdmin = require('../util/helpers').checkIfAdmin;

let db;
let gameSessions;

module.exports = class gameSessionDAO {
    static async injectDB(conn, database) {
        if (gameSessions) {
            return;
        }
        try {
            db = await conn.db(database);
            gameSessions = await db.collection('gameSessions');
        }
        catch(err) {
            console.error(
                `Unable to establish a collection handle in gameSessionDAO: ${err}`
            );
        }
    }

    static async initializeGameData(session_id, gameData) {
        let result = gameData;

        try {
            if (!session_id) {
                await gameSessions.insertOne(gameData);

                if (!gameData.assignedPlayer) {
                    result.assignedPlayer = 1;
                }

                result._id = gameData._id;
            }
            else {
                result = await gameSessions.findOne({ _id: mongo.ObjectID(session_id) });
                result.assignedPlayer = 2;
            }
        }
        catch(err) {
            console.error(
                `Unable to initialize game data in gameSessionDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async updateGameData(session_id, gameData) {
        let result = gameData;

        try {
            delete gameData.assignedPlayer;
            delete gameData.hasPlayerJoined;

            const updatedGameData = {
                ...gameData
            };

            delete updatedGameData._id;

            const existsRes = await gameSessions.findOne({ _id: mongo.ObjectID(session_id) });

            if (existsRes && Object.keys(existsRes).length > 0) {
                await gameSessions.updateOne({ _id: mongo.ObjectID(session_id) }, { $set: updatedGameData });
            }
            else {
                await gameSessions.insertOne({ _id: mongo.ObjectID(session_id), ...gameData });
            }

            result = gameData;
        }
        catch(err) {
            console.error(
                `Unable to update game data in gameSessionDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async deleteGameData(session_id) {
        let result = null;

        try {
            await gameSessions.deleteOne({ _id: mongo.ObjectID(session_id) });
            result = 'OK';
        }
        catch(err) {
            console.error(
                `Unable to delete game data in gameSessionDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async retrieveGameData(session_id) {
        let result = null;

        try {
            result = await gameSessions.findOne({'_id': mongo.ObjectID(session_id)});
        }
        catch(err) {
            console.error(
                `Unable retrieve game data in gameSessionDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async clearGameSessions(isAdmin) {
        let result = null;

        try {
            checkIfAdmin(isAdmin);

            await gameSessions.deleteMany({});
            result = 'OK';
        }
        catch(err) {
            console.error(
                `Unable to delete game sessions in gameSessionDAO: ${err}`
            );
            throw err;
        }

        return result;
    }
}