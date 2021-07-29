import express from 'express';
import cors from 'cors';
import contactFormDAO from '../DAO/contactFormDAO';
import { corsOptionsDelegate, addHeaders, isAdmin, checkIfAdmin, onRouteError, isJSONPropDefined, logMessage } from '../util/helpers';
import { SMTP_HOST, SMTP_USER, SMTP_PASS, HOSTNAME_FOLDER_NAME } from '../config';
import mailer from '../util/mailer';

const contactFormRoutesAPI = express.Router();

contactFormRoutesAPI.options('', cors(corsOptionsDelegate), (req, res) => {
  addHeaders(req, res);
});

contactFormRoutesAPI.options('/send-form', cors(corsOptionsDelegate), (req, res) => {
    addHeaders(req, res);
});

contactFormRoutesAPI.options('/retrieve-timestamps', cors(corsOptionsDelegate), (req, res) => {
  addHeaders(req, res);
});

contactFormRoutesAPI.options('/retrieve-form-data', cors(corsOptionsDelegate), (req, res) => {
  addHeaders(req, res);
});

contactFormRoutesAPI.options('/delete-form-data', cors(corsOptionsDelegate), (req, res) => {
  addHeaders(req, res);
});

contactFormRoutesAPI.post('/send-form', async (req, res) => {
  addHeaders(req, res);

  addHeaders(req, res);

    const account = {
        smtp: {
            host: SMTP_HOST,
            // port: 25,
            secure: true
        },
        user: SMTP_USER,
        pass: SMTP_PASS
    };

    try {
        const formData = req.body.formData;

        const currDateMill = new Date().getTime();
        formData.timestamp = currDateMill;

        const result = await contactFormDAO.submitForm(formData);
        logMessage('Form Submitted to Database!');
        
        if (isJSONPropDefined(formData, 'recipient')) {
          const mailErr = await mailer(account, `contactus@${HOSTNAME_FOLDER_NAME}`, formData);

          if (mailErr) throw Error(mailErr);
        }

        res.status(200).send(result).end();
    }
    catch(e) {
        onRouteError(res, e, 'ERROR');
    }
});

contactFormRoutesAPI.post('/retrieve-timestamps', async (req, res) => {
  addHeaders(req, res);

  try {
    checkIfAdmin(isAdmin(req));

    const skipCursor = (req.body.skipCursor !== undefined) ? Number(req.body.skipCursor) : 0;
    const formLimit = (req.body.formLimit !== undefined) ? Number(req.body.formLimit) : -1;

    const result = await contactFormDAO.getFormTimestamps(skipCursor, (formLimit > -1) ? formLimit : 5, isAdmin(req));

    res.status(200).send(result).end();
  }
  catch(e) {
    onRouteError(res, e, { skipCursor: 0, timestamps: [] });
  }
});

contactFormRoutesAPI.post('/retrieve-form-data', async (req, res) => {
  addHeaders(req, res);

  try {
    checkIfAdmin(isAdmin(req));

    const formID = req.body.formID;

    const formData = await contactFormDAO.getForm(formID, isAdmin(req));
    console.log(formData);
    res.status(200).send(formData).end();
  }
  catch(e) {
    onRouteError(res, e, 'ERROR');
  }
});

contactFormRoutesAPI.post('/delete-form-data', async (req, res) => {
  addHeaders(req, res);

  try {
    checkIfAdmin(isAdmin(req));

    const formID = req.body.formID;

    const formData = await contactFormDAO.deleteForm(formID, isAdmin(req));
    console.log(formData);
    res.status(200).send(formData).end();
  }
  catch(e) {
    onRouteError(res, e, 'ERROR');
  }
});

export const contactFormRoutes = contactFormRoutesAPI;
export const contactFormDBComms = async (client, db) => await contactFormDAO.injectDB(client, db);