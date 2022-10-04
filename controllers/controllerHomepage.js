const axios = require("axios");
const qs = require("qs");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
let token;

const getToken = async () => {
   const data = qs.stringify({ grant_type: "client_credentials" });
   const auth_token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, "utf-8").toString("base64");

   const authOptions = {
      headers: {
         Authorization: `Basic ${auth_token}`,
         "Content-Type": "application/x-www-form-urlencoded",
      },
   };

   try {
      const response = await axios.post("https://accounts.spotify.com/api/token", data, authOptions);
      token = response.data.access_token;
      console.log("token requested");
      return token;
   } catch (error) {
      return error;
   }
};

const doSearching = async (search, newToken) => {
   let allSongs = [];

   const artistParams = {
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${newToken}`,
      },
   };

   const getSongs = await axios.get(`https://api.spotify.com/v1/search?q=${search}&type=artist,album,track,playlist`, artistParams);

   const results = getSongs.data.tracks.items;

   results.forEach((track) => {
      if (track.preview_url) {
         const allTracks = {
            id: track.id,
            title: track.name,
            track: track.preview_url,
            artist_name: track.artists[0].name,
            album_img: track.album.images[0].url,
         };

         allSongs.push(allTracks);
      }
   });

   return allSongs;
};

exports.startSearch = async (req, res) => {
   const { search } = req.body;

   try {
      const results = await doSearching(search, token);
      res.send(results.splice(0, 9));
   } catch (err) {
      // when token expired
      try {
         if (err.response.status === 401 || err.code === "ECONNRESET") {
            const renewToken = await getToken();
            console.log("refresh token");

            const results = await doSearching(search, renewToken);
            res.send(results.splice(0, 9));

            return;
         }
      } catch (innerErr) {
         console.log("search", err);
         res.status(401).json(err);
      }
   }
};
