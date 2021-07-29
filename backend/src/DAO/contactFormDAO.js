var mongo = require('mongodb');
var checkIfAdmin = require('../util/helpers').checkIfAdmin;

let db;
let contactFormCollection;

module.exports = class FormsDAO {
  static async injectDB(conn, database) {
    if (contactFormCollection) {
      return;
    }
    try {
      db = await conn.db(database);
      contactFormCollection = await db.collection('contactForms');
    }
    catch(err) {
      console.error(
        `Unable to establish a collection handle in contactFormsDAO: ${err}`
      );
    }
  }

  static async submitForm(formData) {
    let result;

    try {
      await contactFormCollection.insertOne(formData);
      result = 'OK';
    }
    catch(err) {
      console.error(
          `Unable to submit form data in contactFormsDAO: ${err}`
      );
      throw err;
    }

    return result;
  }

  static async getFormTimestamps(skipCursor, queryLimit, isAdmin) {
    let result;

    const pipeline = [
      {
        '$match': {
          'message': {
            '$exists': true
          }
        }
      }, {
        '$sort': {
          'timestamp': -1
        }
      }, {
        '$facet': {
          'docCount': [
            {
              '$count': 'docCount'
            }
          ], 
          'timestamps': [
            {
              '$skip': skipCursor
            }, {
              '$limit': queryLimit
            }, {
              '$project': {
                'timestamp': 1
              }
            }
          ]
        }
      }, {
        '$unwind': {
          'path': '$docCount'
        }
      }, {
        '$project': {
          'docCount': '$docCount.docCount', 
          'timestamps': 1
        }
      }
    ];

    try {
      checkIfAdmin(isAdmin);

      const cursor = await contactFormCollection.aggregate(pipeline).next();

      const timestamps = cursor.timestamps;
      const totalDocCount = cursor.docCount;
      const newSkipCursorVal = (timestamps.length + skipCursor) % totalDocCount;

      result = { skipCursor: newSkipCursorVal, timestamps: timestamps };
    }
    catch(err) {
      console.error(
          `Unable retrieve form timestamps in contactFormsDAO: ${err}`
      );
      throw err;
    }

    return result;
  }

  static async getForm(formID, isAdmin) {
    let result;

    try {
      checkIfAdmin(isAdmin);

      const oFormID = mongo.ObjectID(formID);
      result = await contactFormCollection.findOne({'_id': oFormID});
    }
    catch(err) {
      console.error(
        `Unable retrieve form contents in contactFormsDAO: ${err}`
      );
      throw err;
    }

    return result;
  }

  static async deleteForm(formID, isAdmin) {
    let result;

    try {
      checkIfAdmin(isAdmin);

      const oFormID = mongo.ObjectID(formID);
      await contactFormCollection.deleteOne({'_id': oFormID});
      result = 'OK';
    }
    catch(err) {
      console.error(
        `Unable retrieve form contents in contactFormsDAO: ${err}`
      );
      throw err;
    }

    return result;
  }
}