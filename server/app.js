require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const port = 5000;
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
// const { v2: cloudinary } = require("cloudinary");
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.json());

app.use("/api/v1/user", require("./routes/user.routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/file", require("./routes/file.routes"));
app.use("/api/v1/folder", require("./routes/folder.routes"));

app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

const server = app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.DB_URL).then(() => {
      console.log("DB Connection established");
    });
  } catch (error) {
    console.log(error, "Server intialization failed");
  }
});

module.exports = server;
