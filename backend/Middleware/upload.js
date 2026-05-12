const multer = require("multer");

const cloudinary = require(
  "../config/cloudinary"
);

const {
  CloudinaryStorage,
} = require(
  "multer-storage-cloudinary"
);

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: async (
      req,
      file
    ) => ({
      folder: "utkal-media",

      resource_type: "auto",

      public_id:
        Date.now() +
        "-" +
        file.originalname,
    }),
  });

const upload = multer({
  storage,
});

module.exports = upload;