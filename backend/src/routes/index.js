import mainRoutes from './main';
import userRoutes from './user';
import sessionRoutes from './session';
import hookRoutes from './hook';
import { templateRoutes, templateDBComms } from './template';
import { siteInfoRoutes, siteInfoDBComms } from './site_info';
import { contactFormRoutes, contactFormDBComms } from './contact_form';
import gameRoutes from './game';

export default async (apiRouter, client, db) => {
    apiRouter.use('/', mainRoutes);
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
    apiRouter.use('/hook', hookRoutes);
    apiRouter.use('/template', templateRoutes);
    apiRouter.use('/site-info', siteInfoRoutes);
    apiRouter.use('/contact-form', contactFormRoutes);
    apiRouter.use('/game', gameRoutes);

    await templateDBComms(client, db);
    await siteInfoDBComms(client, db);
    await contactFormDBComms(client, db);
};