var mongo = require('mongodb');

let db;
let testCollection; //May not be needed if the DAO is retrieving from multiple/variable collections.

module.exports = class templateDAO {
    static async injectDB(conn, database) {
        if (testCollection) {
            return;
        }
        try {
            db = await conn.db(database);

            //May not be needed if the DAO is retrieving from multiple/variable collections.
            //In such a case, this next line is placed in the actual function itself and not here.
            testCollection = await db.collection('testCollection');
        }
        catch(err) {
            console.error(
                `Unable to establish a collection handle in templateDAO: ${err}`
            );
        }
    }

    static async sendTestData(testData) {
        let result;

        try {
            const currDateMill = new Date().getTime();
            testData.timestamp = currDateMill;

            await testCollection.insertOne(testData);
            result = 'OK';
        }
        catch(err) {
            try {
                const currDateMill = new Date().getTime();
                testData.timestamp = currDateMill;
    
                await testCollection.updateOne({ _id: testData._id }, { $set: { ...testData } });
                result = 'OK';
            }
            catch(err) {
                console.error(
                    `Unable to submit form data in templateDAO: ${err}`
                );
                throw err;
            }
        }

        return result;
    }

    static async retrieveTestData(dataID) {
        let result;

        try {
            //The next line might be needed if we use an ObjectID
            //const oDataID = mongo.ObjectID(dataID);
            result = await testCollection.findOne({'_id': dataID});
        }
        catch(err) {
            console.error(
                `Unable retrieve form contents in templateDAO: ${err}`
            );
            throw err;
        }

        return result;
    }
}