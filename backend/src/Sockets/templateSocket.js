var templateDAO = require('../DAO/templateDAO');

module.exports = async (io, client, database) => {
  await templateDAO.injectDB(client, database);

  io
    .of('/templatedb')
    .on('connection', socket => {
      socket.on('testDataSendReq', async testData => {
        try {
          const res = await templateDAO.sendTestData(testData);
          console.log('Test Data Submitted to MongoDB!');
          socket.emit('testDataSendRes', res);
        }
        catch(e) {
          console.log(e.message);
          socket.emit('testDataSendRes', 'ERROR');
        }
      });

      socket.on('testDataRetReq', async testDataID => {
        try {
          const testData = await templateDAO.retrieveTestData(testDataID);
          console.log('Test Data Retrieved from MongoDB!');
          socket.emit('testDataRetRes', testData);
        }
        catch(e) {
          console.log(e.message);
          socket.emit('testDataRetRes', 'ERROR');
        }
      });
    });
};