import userRoutes from './user';
import sessionRoutes from './session';
import hookRoutes from './hook';

export default apiRouter => {
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
    apiRouter.use('/hook', hookRoutes);
};