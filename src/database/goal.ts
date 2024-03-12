import {db} from './index';
export interface Goal {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    progress: number;
    owner_id: number;
    gmt_create: string;
    gmt_modified: string;
}

export const SELECT_ALL = async () => {
    const data = await db.query('SELECT * FROM goal_management');
    return data;
};

export const INSERT_NEW = async (goal: Goal) => {
    const data = await db.query(
        `INSERT INTO goal_management 
        (title, description, start_date, end_date, status, progress, owner_id, gmt_create, gmt_modified) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            goal.title,
            goal.description,
            goal.start_date,
            goal.end_date,
            goal.status,
            goal.progress,
            goal.owner_id,
            goal.gmt_create,
            goal.gmt_modified,
        ],
    );
    return data;
};

export const UPDATE_GOAL = async (goal: Goal) => {
    const data = await db.query(
        `UPDATE goal_management SET 
        title = ?, description = ?, start_date = ?, end_date = ?, status = ?, progress = ?, owner_id = ?, gmt_create = ?, gmt_modified = ? 
        WHERE id = ?`,
        [
            goal.title,
            goal.description,
            goal.start_date,
            goal.end_date,
            goal.status,
            goal.progress,
            goal.owner_id,
            goal.gmt_create,
            goal.gmt_modified,
            goal.id,
        ],
    );
    return data;
};
