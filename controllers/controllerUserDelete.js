const db = require("../database/dbConnect");

exports.delete = (req, res) => {
   const id = req.params.id;

   const myQuery = `DELETE FROM users WHERE user_id = ?`;

   db.query(myQuery, id, (err, results) => {
      if (err) {
         return console.log(err.message);
      }

      if (results.affectedRows > 0) {
         return res.json({ message: "Deleted Successfuly" });
      }

      return res.json(results);
   });
};
