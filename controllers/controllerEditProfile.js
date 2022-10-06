const db = require("../database/dbConnect");

exports.update = (req, res) => {
   const { id, first_name, last_name, image } = req.body;
   let receivedImage;
   let getImagePath;

   if (image || image === "") {
      getImagePath = image;
   } else {
      receivedImage = req.files.image[0];
      getImagePath = req.protocol + "://" + req.get("host") + "/public/uploads/" + receivedImage.filename;
   }

   const myQuery = `UPDATE users SET first_name=?, last_name=?, image=? WHERE user_id = ?`;

   db.getConnection((connectError, connection) => {
      if (connectError) {
         console.log("connectdb error", connectError);
         return;
      }

      connection.query(myQuery, [first_name, last_name, getImagePath, id], (err, results) => {
         if (err) {
            return console.log(err.message);
         }
         res.status(200).json({ message: "Update Successfully", image: getImagePath });
      });

      connection.release();
   });
};
