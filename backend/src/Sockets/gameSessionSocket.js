var gameSessionDAO = require('../DAO/gameSessionDAO');

module.exports = async (io, client, database) => {
  await gameSessionDAO.injectDB(client, database);

  io
    .of('/gameSession')
    .on('connection', socket => {
        socket.on('room', room => {
            socket.join(room);
        });

        socket.on('gameDataInitReq', async (session_id, gameData) => {
            try {
                const res = await gameSessionDAO.initializeGameData(session_id, gameData);
                console.log('Game Data Initialized on MongoDB!');
                socket.emit('gameDataInitRes', { game: res });
            }
            catch(e) {
                console.log(e.message);
                socket.emit('gameDataInitRes', { message: 'Could not initialize game data!', game: res });
            }
        });

        socket.on('gameDataUpdateReq', async (session_id, gameData) => {
            try {
                const res = await gameSessionDAO.updateGameData(session_id, gameData);
                console.log('Game Data Updated on MongoDB!');
                socket.in(session_id).emit('gameDataUpdateRes', { game: res });
            }
            catch(e) {
                console.log(e.message);
                socket.in(session_id).emit('gameDataUpdateRes', { message: 'Could not update game data!', game: res });
            }
        });
    });
};