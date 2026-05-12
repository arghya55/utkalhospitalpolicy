const Media = require("../models/Media");

exports.uploadMedia = async (req, res) => {
  try {

    const user = req.user;

    const media = await Media.create({
      title: req.body.title,

      type: req.file.mimetype.startsWith("video")
        ? "video"
        : "image",

      url: req.file.path,

      department: user.department,

      uploadedBy: user.id,
    });

    res.json(media);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};


exports.getMedia = async (req, res) => {
  try {

    const media = await Media.find({
      department: req.query.departmentId,
    });

    res.json(media);

  } catch (err) {
    res.status(500).json({
      message: "Fetch failed",
    });
  }
};