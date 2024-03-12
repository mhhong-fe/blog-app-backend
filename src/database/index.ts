import mysql from 'mysql2/promise';
import {sqlConfig} from '../config';

const db = mysql.createPool(sqlConfig);

export {db};
export * as goalApi from './goal';
