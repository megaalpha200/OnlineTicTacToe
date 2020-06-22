import userRoutes from './user';
import sessionRoutes from './session';
import hookRoutes from './hook';
import { templateRoutes, templateDBComms } from './template';

export default async (apiRouter, client, db) => {
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
    apiRouter.use('/hook', hookRoutes);
    apiRouter.use('/template', templateRoutes);

    await templateDBComms(client, db);
};