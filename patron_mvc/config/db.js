import mysql from 'mysql2/promise';
import {config} from './key.js';

const connection = mysql.createPool(config);

connection.getConnection()
    .then(connection => {
        console.log('DB is connected');
        connection.release(); 
    })
    .catch(err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('BAD DATABASE ERROR: ', err.sqlMessage);
        }
        console.error('DB Connection Error: ', err);
    });

export { connection };
