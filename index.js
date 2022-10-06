const express = require("express");
const path = require("path");
const db = require("./database/dbConnect");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config({ path: "./.env" });
const port = process.env.PORT || process.env.SERVER_PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(morgan("tiny"));

app.use("/", require("./routes/routesHomepage"));
app.use("/users", require("./routes/routesUser"));

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);

   db.getConnection((err, connection) => {
      if (err) {
         console.log("Database Error:", err);
      } else {
         console.log("Database Successfuly Connected!");
         connection.release();
      }
   });
});
