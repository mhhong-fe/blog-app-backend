const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const categoryRouter = require("./router/category");
const articlesRouter = require("./router/articles");
const userRouter = require("./router/user");

const app = express();
const port = 4000;

// 使用 cors 中间件
app.use(cors());

// 中间件，解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 解析cookie
app.use(cookieParser());

app.use("/category", categoryRouter);
app.use("/article", articlesRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
