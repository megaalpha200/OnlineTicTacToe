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

                const resGameData = {
                    ...res,
                    hasPlayerJoined: res.assignedPlayer
                }

                if (res.assignedPlayer === 2) {
                    const updateData = {
                        ...res,
                        hasP2Joined: true
                    };
                    delete updateData.hasPlayerJoined;

                    await gameSessionDAO.updateGameData(session_id, updateData);
                    resGameData.hasP2Joined = true;
                }

                console.log('Game Data Initialized on MongoDB!');
                socket.emit('gameDataInitRes', { game: resGameData });
                socket.to(session_id).emit('gameDataUpdateRes', { game: resGameData });
            }
            catch(e) {
                console.log(e.message);
                socket.emit('gameDataInitRes', { message: 'Could not initialize game data!', game: {} });
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
                socket.in(session_id).emit('gameDataUpdateRes', { message: 'Could not update game data!', game: {} });
            }
        });

        socket.on('gameDataRejoinReq', async (session_id, assignedPlayer) => {
            try {
                const res = await gameSessionDAO.retrieveGameData(session_id);
                console.log('Game Data Retrieved from MongoDB!');
                socket.to(session_id).emit('gameDataUpdateRes', { game: { ...res, hasPlayerJoined: assignedPlayer } });
                socket.emit('gameDataUpdateRes', { game: { ...res, hasPlayerJoined: assignedPlayer } });
            }
            catch(e) {
                console.log(e.message);
                socket.in(session_id).emit('gameDataUpdateRes', { message: 'Could not update game data!', game: {} });
            }
        });

        socket.on('gameDataChatMsgSentReq', async (session_id, player, message) => {
            try {
                const res = await gameSessionDAO.recordChatMessage(session_id, player, message);
                socket.in(session_id).emit('gameDataChatMsgSentRes', res);
            }
            catch(e) {
                console.log(e.message);
                socket.emit('gameDataChatMsgSentRes', { body: 'Error sending message!', assignedPlayer: Number(player), timestamp: Number(new Date().getTime()) });
            }
        });
    });
};