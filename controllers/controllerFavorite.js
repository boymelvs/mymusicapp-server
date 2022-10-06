const db = require("../database/dbConnect");

exports.add = (req, res) => {
   let error_list = {};
   const { user_id, track_id, title, track, artist_name, album_img } = req.body;

   const myQuery = `INSERT INTO favorite_songs SET ?`;

   db.getConnection((connectError, connection) => {
      if (connectError) {
         console.log("connectdb error", connectError);
         return;
      }

      connection.query(myQuery, { user_id: user_id, track_id: track_id, title: title, track: track, artist_name: artist_name, album_img: album_img }, (err, results) => {
         if (err) {
            res.status(400);

            if (err.errno === 1062) {
               console.log("err.errno", err.errno);
               error_list.duplicate = "Song is already added";
               return res.send(error_list);
            } else {
               return res.send(err.message);
            }
         }

         return res.status(200).json({ message: "Song Added Successfuly" });
      });

      connection.release();
   });
};

exports.delete = (req, res) => {
   const { user_id } = req.body;

   const track_id = req.params.id;

   const myQuery = `DELETE FROM favorite_songs WHERE track_id = ? AND user_id = ?`;

   db.getConnection((connectError, connection) => {
      if (connectError) {
         console.log("connectdb error", connectError);
         return;
      }

      connection.query(myQuery, [track_id, user_id], (err, results) => {
         if (err) {
            return res.status(400).json(err.message);
         }

         if (results.affectedRows > 0) {
            return res.status(200).json({ message: "Deleted Successfuly" });
         }

         return res.json(results);
      });

      connection.release();
   });
};
