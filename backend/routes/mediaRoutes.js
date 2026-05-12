const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Media = require("../models/media");

const auth = require("../middleware/auth");

// ================= MULTER STORAGE =================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    // uploads folder auto create

    if (!fs.existsSync("uploads")) {

      fs.mkdirSync("uploads");
    }

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
        path.extname(
          file.originalname
        )
    );
  },
});

// ================= MULTER =================

const upload = multer({

  storage,

  limits: {
    fileSize:
      50 * 1024 * 1024, // 50MB
  },
});

// ================= FILE TYPE DETECT =================

const detectFileType = (file) => {

  if (!file) return "file";

  const mime =
    file.mimetype;

  const name =
    file.originalname.toLowerCase();

  // IMAGE

  if (
    mime.startsWith("image")
  ) {
    return "image";
  }

  // VIDEO

  if (
    mime.startsWith("video")
  ) {
    return "video";
  }

  // PDF

  if (
    mime.includes("pdf")
  ) {
    return "pdf";
  }

  // WORD

  if (
    mime.includes("word") ||
    mime.includes("document") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return "doc";
  }

  // EXCEL

  if (
    mime.includes("excel") ||
    mime.includes("sheet") ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsx")
  ) {
    return "excel";
  }

  // POWERPOINT

  if (
    mime.includes("presentation") ||
    mime.includes("powerpoint") ||
    name.endsWith(".ppt") ||
    name.endsWith(".pptx")
  ) {
    return "ppt";
  }

  return "file";
};

// ================= UPLOAD =================

router.post(

  "/upload",

  auth,

  (req, res, next) => {

    console.log(
      "🔥 REQUEST HIT"
    );

    next();
  },

  upload.single("file"),

  async (req, res) => {

    try {

      console.log(
        "🔥 BODY:"
      );

      console.log(req.body);

      console.log(
        "🔥 FILE:"
      );

      console.log(req.file);

      const {
        title,
        category,
        description,
        departmentId,
      } = req.body;

      // VALIDATION

      if (!req.file) {

        return res
          .status(400)
          .json({
            message:
              "No file uploaded",
          });
      }

      if (!departmentId) {

        return res
          .status(400)
          .json({
            message:
              "Department ID missing",
          });
      }

      // FILE TYPE

      const fileType =
        detectFileType(
          req.file
        );

      // SAVE DATABASE

      const media =
        await Media.create({

          title,

          description,

          category,

          department:
            departmentId,

          uploadedBy:
            req.user?._id ||
            null,

          // LOCAL FILE URL

          url:
            `/uploads/${req.file.filename}`,

          public_id:
            req.file.filename,

          type:
            fileType,

          likes: 0,

          comments: [],

          status:
            "active",
        });

      res.json(media);

    } catch (err) {

      console.log(
        "🔥 REAL ERROR:"
      );

      console.log(err);

      console.log(
        err.message
      );

      console.log(
        err.stack
      );

      res.status(500).json({

        message:
          err.message,

        error: err,
      });
    }
  }
);

// ================= GET MEDIA =================

router.get(
  "/",

  async (req, res) => {

    try {

      const {
        departmentId,
      } = req.query;

      const media =
        await Media.find({

          department:
            departmentId,
        }).sort({

          createdAt: -1,
        });

      res.json(media);

    } catch (err) {

      console.log(err);

      res
        .status(500)
        .json({
          message:
            "Fetch failed",
        });
    }
  }
);

// ================= STATUS =================

router.put(

  "/:id/status",

  auth,

  async (req, res) => {

    try {

      const status =
        req.body.status;

      if (
        status !== "active" &&
        status !== "inactive"
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid status",
          });
      }

      const media =
        await Media.findById(
          req.params.id
        );

      if (!media) {

        return res
          .status(404)
          .json({
            message:
              "Media not found",
          });
      }

      media.status =
        status;

      await media.save();

      res.json(media);

    } catch (err) {

      console.log(err);

      res
        .status(500)
        .json({
          message:
            "Status update failed",
        });
    }
  }
);

// ================= LIKE =================

router.put(

  "/:id/like",

  async (req, res) => {

    try {

      const media =
        await Media.findById(
          req.params.id
        );

      if (!media) {

        return res
          .status(404)
          .json({
            message:
              "Media not found",
          });
      }

      media.likes += 1;

      await media.save();

      res.json(media);

    } catch (err) {

      console.log(err);

      res
        .status(500)
        .json({
          message:
            "Like failed",
        });
    }
  }
);

// ================= DELETE =================

router.delete(

  "/:id",

  auth,

  async (req, res) => {

    try {

      const media =
        await Media.findById(
          req.params.id
        );

      if (!media) {

        return res
          .status(404)
          .json({
            message:
              "Media not found",
          });
      }

      // ONLY DEPARTMENT

      if (
        req.user.role !==
        "department"
      ) {

        return res
          .status(403)
          .json({
            message:
              "Only department users can delete",
          });
      }

      // CHECK DEPARTMENT

      if (

        String(
          media.department
        ) !==

        String(
          req.user.department
        )

      ) {

        return res
          .status(403)
          .json({
            message:
              "Not your department media",
          });
      }

      // DELETE FILE

      const filePath =
        path.join(
          __dirname,
          "..",
          media.url
        );

      if (
        fs.existsSync(
          filePath
        )
      ) {

        fs.unlinkSync(
          filePath
        );
      }

      // DELETE DB

      await Media.findByIdAndDelete(
        req.params.id
      );

      res.json({

        message:
          "Deleted successfully",
      });

    } catch (err) {

      console.log(err);

      res
        .status(500)
        .json({
          message:
            "Delete failed",
        });
    }
  }
);

module.exports = router;