import {db} from './index';
import {RowDataPacket} from 'mysql2';

export interface User extends RowDataPacket {
    id: number;
    username?: string;
    avatar?: string;
    email: string;
}

export const SELECT_ALL = async () => {
    const data = await db.query('SELECT * FROM user_management');
    return data;
};

export const INSERT_NEW = async (user: User) => {
    const data = await db.query(
        `INSERT INTO user_management 
        (username, email) 
        VALUES (?, ?)`,
        [user.username, user.email],
    );
    return data;
};

export const UPDATE_USER = async (user: User) => {
    const data = await db.query(
        `UPDATE user_management SET 
        username = ?, avatar = ?, email = ?, gmt_create = ?, gmt_modified = ? 
        WHERE id = ?`,
        [user.username, user.avatar, user.email, user.id],
    );
    return data;
};

export const DELETE_USER = async (id: number) => {
    const data = await db.query(`DELETE FROM user_management WHERE id = ?`, [
        id,
    ]);
    return data;
};

export const SELECT_USER_BY_EMAIL = async (email: number) => {
    const [users] = await db.query<User[]>(
        `SELECT * FROM user_management WHERE  email = ?`,
        [email],
    );
    return users;
};
