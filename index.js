const express = require("express");
const flash = require("express-flash");
const app = express();
const routes = require("./routes");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const handleCors = require("./middlewares/cors");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Public"));

app.use(flash());
app.use(cors());
app.use(cookieParser());
app.use(handleCors);

app.get("/", (req, res) => {
  res.json({ message: "api running !!" });
});

app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server connected http://localhost:${port}`);
});
