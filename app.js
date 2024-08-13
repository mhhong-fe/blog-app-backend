const express = require("express");
const app = express();
const port = 4000;

app.get("/blogInfo", (req, res) => {
  const userInfo = {
    message: "Hello Blog",
  };
  res.json(userInfo);
});

app.listen(4000, () => {
  console.log(`Example app listening on port ${4000}`);
});
