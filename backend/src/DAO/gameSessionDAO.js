var mongo = require('mongodb');
var checkIfAdmin = require('../util/helpers').checkIfAdmin;

let db;
let gameSessions;
let gameChatMessages;

module.exports = class gameSessionDAO {
    static async injectDB(conn, database) {
        if (gameSessions) {
            return;
        }
        try {
            db = await conn.db(database);
            gameSessions = await db.collection('gameSessions');
            gameChatMessages = await db.collection('gameChatMessages');
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
                result = await this.retrieveGameData(session_id, false);
                result.assignedPlayer = 2;
                result.p2Name = gameData.p2Name;
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
            await gameChatMessages.deleteMany({ game_session_id: mongo.ObjectID(session_id) });
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

    static async retrieveGameData(session_id, withChatData = true) {
        let result = null;

        try {
            result = await gameSessions.findOne({'_id': mongo.ObjectID(session_id)});
            if (result && withChatData) result.chatMessages = await gameChatMessages.find({ 'game_session_id': mongo.ObjectID(session_id) }, { 'sort': { 'timestamp': 1 } }).toArray();
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

    static async recordChatMessage(session_id, player, message) {
        let result = null;

        try {
            result = { game_session_id: mongo.ObjectID(session_id), 'body': message, assignedPlayer: Number(player), 'timestamp': Number(new Date().getTime()) };
            await gameChatMessages.insertOne(result);
        }
        catch(err) {
            console.error(
                `Unable to record chat message in gameSessionDAO: ${err}`
            );
            throw err;
        }

        return result;
    }
}