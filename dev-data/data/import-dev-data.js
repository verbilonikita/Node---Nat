const dotenv = require("dotenv");

const fs = require("fs");

const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB connected"));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

//import data

const importData = async function () {
  try {
    await Tour.create(tours);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from collection

const deleteData = async function () {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
