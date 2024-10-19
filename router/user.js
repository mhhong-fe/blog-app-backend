var express = require("express");
const pool = require("../config/dbConfig");
const { generateToken } = require("../middleware/jwt");
const axios = require("axios");

var router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.json({
            code: 400,
            msg: "用户信息不完整",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        // 使用连接执行查询
        const [rows, fields] = await connection.execute(
            `SELECT * FROM users WHERE user_name='${username}'`
        );
        if (rows.length > 0) {
            res.json({
                code: 400,
                msg: "用户名已存在",
            });
            return;
        }
        const result = await connection.execute(
            `INSERT INTO users (user_name, user_password) VALUES ('${username}', '${password}')`
        );
        res.status(200).json({
            code: 200,
            msg: "注册成功",
        });
    } catch (err) {
        // 处理错误
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        // 确保连接被释放回连接池（如果它仍然存在）
        if (connection) {
            connection.release();
        }
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();
        // 查询用户
        const [rows] = await connection.execute(
            `SELECT * FROM users WHERE user_name = '${username}'`
        );
        if (rows.length === 0) {
            return res.json({
                code: 400,
                msg: "用户名或密码错误",
            });
        }

        const user = rows[0];

        // 验证密码
        if (password !== user["user_password"]) {
            return res.json({
                code: 400,
                msg: "用户名或密码错误",
            });
        }

        // 生成JWT（可选）
        const token = generateToken(user["user_id"]);
        res.cookie("token", token, { httpOnly: true });

        res.json({
            code: 200,
            msg: "登陆成功",
        });
    } catch (err) {
        // 处理错误
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        // 确保连接被释放回连接池（如果它仍然存在）
        if (connection) {
            connection.release();
        }
    }
});

module.exports = router;
