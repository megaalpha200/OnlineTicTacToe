var templateSocket = require('./templateSocket');
var sessionsSocket = require('./sessionsSocket');
var gameSessionSocket = require('./gameSessionSocket');

module.exports.initializeSockets = async (io, client, database) => {
    await templateSocket(io, client, database);
    await sessionsSocket(io, client, database);
    await gameSessionSocket(io, client, database);
};