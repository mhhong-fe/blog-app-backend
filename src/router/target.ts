import {targetApi} from '../database';
import {HandleHttpApi} from './interface';

const getAllTarget: HandleHttpApi = async (req, res) => {
    const [data] = await targetApi.SELECT_ALL();
    res.send(data);
};

export default {getAllTarget};
