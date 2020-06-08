import express from 'express';
const hookRoutes = express.Router();

hookRoutes.post('', async (req, res) => {
    console.log(JSON.stringify(req.body));
    res.status(200).end();
});

export default hookRoutes;