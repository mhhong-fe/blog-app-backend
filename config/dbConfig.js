const mysql = require("mysql2/promise");

// 设置MySQL连接池
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "hmh6861860",
    database: "blog_app",
    waitForConnections: true,
    connectionLimit: 10, // 连接池中允许的最大连接数
    queueLimit: 0, // 队列中允许的最大请求数，0表示无限制
});

module.exports = pool;
