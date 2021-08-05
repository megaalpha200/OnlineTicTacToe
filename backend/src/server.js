import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import connectStore from 'connect-mongo';
import routesSetup from './routes';
import { PORT, HOSTNAME_FOLDER_NAME, NODE_ENV, MONGODB_URI, MONGODB_DATABASE_NAME, SESSION_NAME, SESSION_SECRET, SESSION_TTL, LOCAL_SSL } from './config';

import http from 'http';
import https from 'https';
import fs from 'fs';
import mongo from 'mongodb';
import SocketIO from 'socket.io';
import { initializeSockets } from './Sockets';

const shouldUseLocalSSLCerts = LOCAL_SSL === 'true';

(async () => {
    try {
        const app = express();

        const path = `${__dirname}/letsencrypt/live/${HOSTNAME_FOLDER_NAME}`;
        var options = {};

        if (shouldUseLocalSSLCerts) {
            options = {
                key: fs.readFileSync(`${path}/privkey.pem`),
                cert: fs.readFileSync(`${path}/fullchain.pem`)
            };
        }

        const MongoClient = mongo.MongoClient;
        const server = (shouldUseLocalSSLCerts) ? https.createServer(options, app) : http.createServer(app);
        const io = SocketIO(server, {
            cors: {
                origin: true,
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');

        const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await initializeSockets(io, client, MONGODB_DATABASE_NAME);
        console.log('Sockets Initialized');

        const MongoStore = connectStore(session);

        app.disable('x-powered-by');
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        if (NODE_ENV === 'production' && !shouldUseLocalSSLCerts) app.set('trust proxy', 1);
        
        const sessionMiddleware = session({
            name: SESSION_NAME,
            secret: SESSION_SECRET,
            saveUninitialized: false,
            resave: true,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                collection: 'session',
                ttl: parseInt(SESSION_TTL) / 1000,
                stringify: false
            }),
            cookie: {
                sameSite: true,
                secure: NODE_ENV === 'production',
                maxAge: parseInt(SESSION_TTL)
            }
        });

        io.use((socket, next) => {
            sessionMiddleware(socket.request, socket.request.res || {}, next);
        });

        app.use(sessionMiddleware);

        const apiRouter = express.Router();
        app.use('/api', apiRouter);
        app.use((_, res) => {
            res.status(302).redirect(`https://${HOSTNAME_FOLDER_NAME}`);
        });
        routesSetup(apiRouter, client, MONGODB_DATABASE_NAME);

        server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    catch(err) {
        console.log(err);
    }
})();