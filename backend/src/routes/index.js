import userRoutes from './user';
import sessionRoutes from './session';
import hookRoutes from './hook';
import { gameRoutes, gameDBComms } from './game';

export default async (apiRouter, client, db) => {
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
    apiRouter.use('/hook', hookRoutes);

    await gameDBComms(client, db);
    apiRouter.use('/game', gameRoutes);
};