import express from 'express';

import goal from './goal';

const router = express.Router();

router.use('/goal', goal);

export default router;
