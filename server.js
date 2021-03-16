// Config for env variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Express
const app = require("./app");

// Mongoose DB
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected..."));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
