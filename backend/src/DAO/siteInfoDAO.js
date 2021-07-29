var mongo = require('mongodb');
var checkIfAdmin = require('../util/helpers').checkIfAdmin;

let db;
let siteInfoCollection;

module.exports = class siteInfoDAO {
    static async injectDB(conn, database) {
        if (siteInfoCollection) {
            return;
        }
        try {
            db = await conn.db(database);
            siteInfoCollection = await db.collection('site_info');
        }
        catch(err) {
            console.error(
                `Unable to establish a collection handle in siteInfoDAO: ${err}`
            );
        }
    }

    static async retrieveSiteInfoData() {
        let result;

        try {
            result = await siteInfoCollection.findOne();
            result.last_update = result.last_update * 1000;
            delete result._id;
        }
        catch(err) {
            console.error(
                `Unable retrieve site info data in siteInfoDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async updateSiteUpdateDate(isAdmin) {
        let result;

        try {
            checkIfAdmin(isAdmin);

            await siteInfoCollection.updateMany({}, { '$set': { 'last_update': mongo.Timestamp(new Date().getTime() / 1000) } });
            result = 'OK';
        }
        catch(err) {
            console.error(
                `Unable retrieve site info data in siteInfoDAO: ${err}`
            );
            throw err;
        }

        return result;
    }

    static async updateSiteMarqueeText(marqueeText, isAdmin) {
        let result;

        try {
            checkIfAdmin(isAdmin);

            await siteInfoCollection.updateMany({}, { '$set': { 'marquee_text': marqueeText } });
            result = 'OK';
        }
        catch(err) {
            console.error(
                `Unable retrieve site info data in siteInfoDAO: ${err}`
            );
            throw err;
        }

        return result;
    }
}