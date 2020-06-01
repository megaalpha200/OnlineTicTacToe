import userRoutes from './user';
import sessionRoutes from './session';

export default apiRouter => {
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/session', sessionRoutes);
};