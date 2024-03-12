import {sqlConnection} from '../index';

const SELECT_ALL = async () => {
    const data = await sqlConnection.query('SELECT * FROM goal_management');
    return data;
};

export {SELECT_ALL};
