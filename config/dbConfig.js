const mysql = require("mysql2/promise");

// 需要把这里换成真实的服务器信息
// 设置MySQL连接池
const pool = mysql.createPool({
    host: "114.55.133.112",
    port: 3306,
    user: "root",
    password: "@Hmh6861860@",
    database: "blog_app",
    waitForConnections: true,
    connectionLimit: 10, // 连接池中允许的最大连接数
    queueLimit: 0, // 队列中允许的最大请求数，0表示无限制
});

module.exports = pool;
