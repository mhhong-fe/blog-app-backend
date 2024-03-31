import express from 'express';

import goal from './goal';
import user from './user';

const router = express.Router();

router.use('/goal', goal);
router.use('/user', user);

export default router;
