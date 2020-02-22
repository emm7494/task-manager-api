const express = require("express");
require("./db/mongoose");
const { taskRouter, userRouter } = require("./routes");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(taskRouter, userRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
