var express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { transformArray } = require("../utils/index");
const pool = require("../config/dbConfig");

var router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
    const { categoryName, categoryDesc } = req.body;
    if (!categoryName || !categoryDesc) {
        res.json({
            code: 400,
            msg: "分类信息不完整",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        // 使用连接执行查询
        const [rows, fields] = await connection.execute(
            `SELECT * FROM category WHERE category_name='${categoryName}'`
        );
        if (rows.length > 0) {
            res.json({
                code: 400,
                msg: "分类名已存在",
            });
            return;
        }
        const result = await connection.execute(
            `INSERT INTO category (category_name, category_desc) VALUES ('${categoryName}', '${categoryDesc}')`
        );
        res.status(200).json({
            code: 200,
            msg: "添加成功",
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

router.post("/edit", verifyToken, async (req, res) => {
    const { categoryName, categoryDesc, id } = req.body;
    if (!categoryName || !categoryDesc || !id) {
        res.json({
            code: 400,
            msg: "分类信息不完整",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        // 使用连接执行查询
        const [rows, fields] = await connection.execute(
            `SELECT * FROM category WHERE id='${id}'`
        );
        if (rows.length === 0) {
            res.json({
                code: 400,
                msg: "该分类不存在",
            });
            return;
        }
        const sqlQuery = `  
            UPDATE category  
            SET category_name = '${categoryName}',  
                category_description = '${categoryDesc}'  
            WHERE category_id = ${id}  
        `;
        const result = await connection.execute(sqlQuery);
        res.status(200).json({
            code: 200,
            msg: "添加成功",
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

router.post("/delete", verifyToken, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.json({
            code: 400,
            msg: "缺失必要的参数",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        const sqlQuery = `Delete FROM category WHERE id = ${id}`;
        const result = await connection.execute(sqlQuery);
        res.status(200).json({
            code: 200,
            msg: "删除成功",
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

router.get("/list", async (req, res) => {
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();
        const sqlQuery = `SELECT * FROM category`;
        const [rows, fields] = await connection.execute(sqlQuery);
        res.status(200).json({
            code: 200,
            msg: "查询成功",
            data: transformArray(rows),
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
