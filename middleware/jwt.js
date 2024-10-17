// 中间件来验证Token
const jwt = require("jsonwebtoken"); // 假设你正在使用JWT

const jwtSecret = "blog_admin";

function generateToken(userId) {
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "1d" });
    return token;
}

function verifyToken(req, res, next) {
    console.log({ req });
    const token = req.cookies.token;

    if (!token) {
        return res.json({
            code: 700,
            msg: "无效的token",
        });
    }

    jwt.verify(token, jwtSecret, (err, userId) => {
        if (err) {
            return res.json({
                code: 700,
                msg: "无效的token",
            });
        }
        req.userId = userId;
        next(); // 调用next()来继续处理请求
    });
}

module.exports = {
    generateToken,
    verifyToken,
};
