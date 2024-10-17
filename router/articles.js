var express = require("express");
const { verifyToken } = require("../middleware/jwt");
const { transformArray } = require("../utils/index");
const pool = require("../config/dbConfig");

var router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
    const { title, content, articleDesc, categoryId } = req.body;
    if (!title || !content || !articleDesc || !categoryId) {
        return res.json({
            code: 400,
            msg: "文章信息不完整",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        // 使用连接执行查询
        const [rows, fields] = await connection.execute(
            `SELECT * FROM articles WHERE title='${title}'`
        );
        if (rows.length > 0) {
            res.json({
                code: 400,
                msg: "文章标题已存在",
            });
            return;
        }
        const sqlQuery = `INSERT INTO articles (title, article_desc, content, category_id) 
            VALUES ('${title}', '${articleDesc}', '${content}', '${categoryId}')`;
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

router.post("/edit", verifyToken, async (req, res) => {
    const { id, title, content, articleDesc, categoryId } = req.body;
    if (!id || !title || !content || !articleDesc || categoryId) {
        res.json({
            code: 400,
            msg: "文章信息不完整",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        // 使用连接执行查询
        const [rows, fields] = await connection.execute(
            `SELECT * FROM articles WHERE id='${id}'`
        );
        if (rows.length === 0) {
            res.json({
                code: 400,
                msg: "该文章不存在",
            });
            return;
        }
        const sqlQuery = `  
            UPDATE articles  
            SET title = '${title}',  
                content = '${content}',
                category_id = '${categoryId}',
                article_desc = '${articleDesc}'  
            WHERE id = ${id}  
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
        return res.json({
            code: 400,
            msg: "缺失必要的参数",
        });
    }
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();

        const sqlQuery = `Delete FROM articles WHERE id = ${id}`;
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

router.post("/list", async (req, res) => {
    let { title, pageNum, pageSize } = req.body;
    let connection;
    try {
        // 从连接池中获取一个连接
        connection = await pool.getConnection();
        let sqlQuery = `SELECT articles.id, articles.title, articles.article_desc, articles.created_time, articles.updated_time, 
            category.category_name FROM articles, category
            WHERE articles.category_id = category.id
            LIMIT ${pageNum}, ${pageSize}`;

        const [rows, fields] = await connection.execute(sqlQuery);
        res.status(200).json({
            code: 200,
            msg: "查询成功",
            data: transformArray(rows),
            pageDto: {
                pageNum: pageNum,
                pageSize: pageSize,
                total: rows.length,
            },
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
