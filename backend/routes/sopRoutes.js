const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Sop = require("../models/sop");
const auth = require("../Middleware/auth");

const {
  reorderSops,
} = require("../controllers/sopController");




// ================= CREATE SOP =================
router.post("/", auth, async (req, res) => {
  try {
   const count =
  await Sop.countDocuments({
    department: req.body.department,
  });

const sop = await Sop.create({
  ...req.body,
  order: count,
});

    res.status(201).json(sop);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create SOP",
    });
  }
});

router.put("/reorder", reorderSops);

// ================= GET SOP =================
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.departmentId) {
      filter.department = req.query.departmentId;
    }

    const sops = await Sop.find(filter)
      .populate("department");

    res.json(sops);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch SOP",
    });
  }
});


// ================= UPDATE SOP =================
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Sop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update SOP",
    });
  }
});


// ================= DELETE SOP =================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Sop.findByIdAndDelete(req.params.id);

    res.json({
      message: "SOP deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete SOP",
    });
  }
});

module.exports = router;