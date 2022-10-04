const db = require("../database/dbConnect");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
   const { email, password } = req.body;
   const myQuery = `SELECT * FROM users WHERE email = ?`;

   db.query(myQuery, email, async (err, results) => {
      if (err) {
         console.log(err);
      }

      if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
         console.log(err);
         return res.status(401).json({ message: "Email or password is incorrect" });
      }

      db.query(`SELECT * FROM favorite_songs WHERE user_id = ?`, results[0].user_id, (err, resultSong) => {
         if (err) {
            console.log(err);
         }

         const favorite = resultSong.map((song) => {
            return { id: song.track_id, title: song.title, track: song.track, artist_name: song.artist_name, album_img: song.album_img };
         });

         const sendResults = {
            id: results[0].user_id,
            first_name: results[0].first_name,
            last_name: results[0].last_name,
            email: results[0].email,
            image: results[0].image,
            is_admin: results[0].is_admin,
            favorites: favorite,
         };

         return res.status(200).json(sendResults);
      });
   });
};
