const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONN_STR, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
