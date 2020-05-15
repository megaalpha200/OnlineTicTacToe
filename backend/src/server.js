import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import connectStore from 'connect-mongo';
import { userRoutes, sessionRoutes } from './routes';
import { PORT, NODE_ENV, MONGODB_URI, MONGODB_DATABASE_NAME, SESSION_NAME, SESSION_SECRET, SESSION_TTL } from './config';

import http from 'http';
import mongo from 'mongodb';
import SocketIO from 'socket.io';
import { initializeSockets } from './Sockets';

(async () => {
    try {
        const app = express();

        const MongoClient = mongo.MongoClient;
        const server = http.createServer(app);
        const io = SocketIO(server);

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');

        const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await initializeSockets(io, client, MONGODB_DATABASE_NAME);
        console.log('Sockets Initialized');

        const MongoStore = connectStore(session);

        app.disable('x-powered-by');
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(session({
            name: SESSION_NAME,
            secret: SESSION_SECRET,
            saveUninitialized: false,
            resave: false,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                collection: 'session',
                ttl: parseInt(SESSION_TTL) / 1000
            }),
            cookie: {
                sameSite: true,
                secure: NODE_ENV === 'production',
                maxAge: parseInt(SESSION_TTL)
            }
        }));

        const apiRouter = express.Router();
        app.use('/api', apiRouter);
        apiRouter.use('/users', userRoutes);
        apiRouter.use('/session', sessionRoutes);

        server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
    catch(err) {
        console.log(err);
    }
})();