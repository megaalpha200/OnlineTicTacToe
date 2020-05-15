var templateSocket = require('./templateSocket');

module.exports.initializeSockets = async (io, client, database) => {
    await templateSocket(io, client, database);
};