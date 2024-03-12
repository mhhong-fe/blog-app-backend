import mysql from 'mysql2/promise';
import {sqlConfig} from '../config';

const sqlConnection = mysql.createPool(sqlConfig);

export {sqlConnection};
export * as targetApi from './target';
