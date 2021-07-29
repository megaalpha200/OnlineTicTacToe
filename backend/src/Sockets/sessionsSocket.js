var sessionsDAO = require('../DAO/sessionsDAO');
var isAdmin = require('../util/helpers').isAdmin;
var isJSONPropDefined = require('../util/helpers').isJSONPropDefined;

module.exports = async (io, client, database) => {
    await sessionsDAO.injectDB(client, database);

    io
        .of('/sessionsdb')
        .on('connection', socket => {
          socket.on('sessionsClearUserReq', async () => {
            try {
              const userId = (isJSONPropDefined(socket.request, 'session.user.userId')) ? socket.request.session.user.userId : null;

              const res = await sessionsDAO.clearUserSessions(userId);
              console.log('User\'s Sessions are Cleared from MongoDB!');
              socket.broadcast.emit(`sessionsClearUserRes${userId}`, res);
              socket.emit(`sessionsClearUserIndvRes${userId}`, res);
            }
            catch(e) {
              console.log(e.message);
              socket.emit(`sessionsClearUserIndvRes${userId}`, 'ERROR');
            }
          });
          socket.on('sessionsClearAllReq', async () => {
            try {
              const res = await sessionsDAO.clearAllSessions(isAdmin(socket.request));
              console.log('All Sessions are Cleared from MongoDB!');
              socket.broadcast.emit('sessionsClearAllRes', res);
              socket.emit('sessionsClearAllIndvRes', res);
            }
            catch(e) {
              console.log(e.message);
              socket.emit('sessionsClearAllIndvRes', 'ERROR');
            }
          });
        });
};