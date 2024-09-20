const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
// const MONGO_URL = 'mongodb://localhost:27017/mlm';
const MONGO_URL =
  "mongodb+srv://marnix12:qFhMwejj1nPEky91@cluster0.lxbe8xg.mongodb.net/mlm?ssl=true&authSource=admin";
//Add Cors
app.use(cors());
app.options("*", cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, {})
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));
// Routes

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
