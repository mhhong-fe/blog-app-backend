import express from 'express';
import {userApi} from '../database';
import {HandleHttpApi} from './interface';

const router = express.Router();

const addUser: HandleHttpApi = async (req, res) => {
    const user = req.body;
    console.log({user});

    const [userInfo] = await userApi.SELECT_USER_BY_EMAIL(user.email);
    if (userInfo) {
        return res.json({
            code: 400,
            msg: '用户已存在',
        });
    }
    const data = await userApi.INSERT_NEW(user);
    res.json({
        code: 200,
        msg: 'success',
        data,
    });
};

const login: HandleHttpApi = async (req, res) => {
    const user = req.body;
    const userInfo = await userApi.SELECT_USER_BY_EMAIL(user.email);
    if (!userInfo.length) {
        return res.json({
            code: 400,
            msg: '用户不存在',
        });
    }
    if (userInfo[0].password !== user.password) {
        return res.json({
            code: 400,
            msg: '用户名或密码错误',
        });
    }
    return res
        .cookie('userInfo', JSON.stringify(userInfo), {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        })
        .json({
            code: 200,
            msg: 'success',
            data: userInfo,
        });
};

router.post('/add', addUser);
router.post('/login', login);

export default router;
