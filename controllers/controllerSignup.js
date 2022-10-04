const db = require("../database/dbConnect");
const bcrypt = require("bcrypt");

const isEmpty = (body, error_list) => {
   for (let field in body) {
      if (!body[field]) {
         error_list[field] = `${field} is required!`;
      }
   }

   if (error_list.length > 0) {
      return true;
   }

   return false;
};

exports.signup = async (req, res) => {
   let error_list = {};

   const { first_name, last_name, email, password, confirm_password } = req.body;

   if (isEmpty(req.body, error_list)) {
      return res.status(400).json(error_list);
   }

   if (password !== confirm_password) {
      error_list.confirm_password = "Password not match!";
      return res.status(400).json(error_list);
   }

   const hashPassword = await bcrypt.hash(password, 10);
   const myQuery = `INSERT INTO users SET ?`;

   db.query(myQuery, { first_name: first_name, last_name: last_name, email: email, password: hashPassword }, (err, results) => {
      if (err) {
         res.status(400);

         if (err.errno === 1062) {
            console.log("err.errno", err.errno);
            error_list.duplicate = "Email already in use";
            return res.send(error_list);
         } else {
            return res.send(err.message);
         }
      }

      if (results.affectedRows >= 1) {
         const newMyQuery = `SELECT * FROM users WHERE email = ?`;

         db.query(newMyQuery, email, (err, results) => {
            if (err) {
               console.log(err);
            }
            const sendResults = {
               id: results[0].user_id,
               first_name: results[0].first_name,
               last_name: results[0].last_name,
               email: results[0].email,
               image: "",
               is_admin: results[0].is_admin,
            };
            return res.status(200).json(sendResults);
         });
      }
   });
};
