var mongo = require('mongodb');
var checkIfAdmin = require('../util/helpers').checkIfAdmin;

let db;
let sessions;

module.exports = class SessionsDAO {
    static async injectDB(conn, database) {
        if (sessions) {
            return;
        }
        try {
          db = await conn.db(database);
          sessions = await db.collection('session');
        }
        catch(err) {
            console.error(
              `Unable to establish a collection handle in sessionsDAO: ${err}`
            );
        }
    }

    static async getUserSessions(userId) {
      let result;
  
      try {
        const userOId = mongo.ObjectID(userId);

        result = (await sessions.countDocuments({ 'session.user.userId': userOId }, { projection: { _id: 1 } })).toString();
      }
      catch(err) {
        console.error(
          `Unable get user sessions in sessionsDAO: ${err}`
        );
        throw err;
      }
  
      return result;
    }

    static async updateUserSessions(userId, sessionData, isAdmin) {
        let result;

        checkIfAdmin(isAdmin);

        try {
            const userOID = mongo.ObjectID(userId);
            sessionData.userId = userOID;

            await sessions.updateMany({ 'session.user.userId': userOID }, { '$set': { 'session.user': sessionData } });
            result = 'OK';
        }
        catch(err) {
            console.error(
                `Unable clear user sessions in sessionsDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async clearUserSessions(userId) {
      let result;
  
      try {
        const userOID = mongo.ObjectID(userId);

        await sessions.deleteMany({ "session.user.userId": userOID });
        result = 'OK';
      }
      catch(err) {
        console.error(
          `Unable clear user sessions in sessionsDAO: ${err}`
        );
        throw err;
      }
  
      return result;
    }

    static async clearAllSessions(isAdmin) {
        let result;

        checkIfAdmin(isAdmin);
    
        try {    
          await sessions.deleteMany({});
          result = 'OK';
        }
        catch(err) {
          console.error(
            `Unable clear user sessions in sessionsDAO: ${err}`
          );
          throw err;
        }
    
        return result;
      }
}