const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const controllerLogin = require("../controllers/controllerLogin");
const controllerSignup = require("../controllers/controllerSignup");
const controllerEditProfile = require("../controllers/controllerEditProfile");
const controllertUserDelete = require("../controllers/controllerUserDelete");
const controllerFavorite = require("../controllers/controllerFavorite");

// create storage
const storage = multer.diskStorage({
   //directory where the image file to be store
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/uploads"));
   },

   //create the name of image file
   filename: (req, file, cb) => {
      const fileName = Date.now() + "musicapp" + "_" + file.fieldname + path.extname(file.originalname);

      cb(null, fileName);
   },
});

const upload = multer({ storage: storage });
const getImage = upload.fields([{ name: "image" }]);

router.post("/login", controllerLogin.login);
router.post("/profile", getImage, controllerEditProfile.update);
router.post("/signup", controllerSignup.signup);

router.post("/add-song", controllerFavorite.add);
router.post("/delete-song/:id", controllerFavorite.delete);
router.delete("/delete/:id", controllertUserDelete.delete);

module.exports = router;
