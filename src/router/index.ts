import express from 'express';

import target from './target';

const router = express.Router();

router.get('/target', target.getAllTarget);

export default router;
