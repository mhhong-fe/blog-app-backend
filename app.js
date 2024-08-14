const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

// 使用 CORS 中间件
app.use(cors());

// 中间件，解析 JSON 请求体
app.use(express.json());

app.get("/blogInfo", (req, res) => {
  const userInfo = {
    message: "Hello Blog",
  };
  res.json(userInfo);
});

app.post("/blogList", (req, res) => {
  const { keyword } = req.body;
  res.json({ code: 200, data: [], msg: "success" });
});

app.listen(4000, () => {
  console.log(`Example app listening on port ${4000}`);
});
