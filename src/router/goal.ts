import express from 'express';
import {goalApi} from '../database';
import {HandleHttpApi} from './interface';

const router = express.Router();

const getAllGoal: HandleHttpApi = async (req, res) => {
    const [data] = await goalApi.SELECT_ALL();
    res.json({
        code: 200,
        msg: 'success',
        data,
    });
};

const addGoal: HandleHttpApi = async (req, res) => {
    const goal = req.body;
    console.log({body: req.body});
    const data = await goalApi.INSERT_NEW(goal);
    res.json({
        code: 200,
        msg: 'success',
        data,
    });
};

const updateGoal: HandleHttpApi = async (req, res) => {
    const goal = req.body;
    const data = await goalApi.UPDATE_GOAL(goal);
    res.json({
        code: 200,
        msg: 'success',
        data,
    });
};

router.get('/list', getAllGoal);
router.post('/add', addGoal);
router.post('/update', updateGoal);

export default router;
