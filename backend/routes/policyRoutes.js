const express = require("express");
const router = express.Router();
const Policy = require("../models/Policy");
const User = require("../models/User");
const auth = require("../Middleware/auth");


const {
  reorderPolicies,
} = require("../controllers/policyController");

// CREATE POLICY
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.canAddPolicy) {
      return res.status(403).json({ message: "Not allowed" });
    }

const count =
  await Policy.countDocuments({
    department: user.department,
  });

const policy = await Policy.create({
  title: req.body.title,

  description: req.body.description,

  department: user.department,

  createdBy: req.user.id,

  order: count,
});

    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/reorder", reorderPolicies);


// ✅ FILTER (MUST BE FIRST)
router.get("/", async (req, res) => {
  try {
    const { departmentId } = req.query;

    const policies = await Policy.find(
      departmentId ? { department: departmentId } : {}
    ).populate("department");

    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET SINGLE POLICY
router.get("/:id", async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    res.json(policy);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= UPDATE =================
router.put("/:id", async (req, res) => {
  try {

    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    // update fields
    if (req.body.title !== undefined) {
      policy.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      policy.description = req.body.description;
    }

    // 🔥 STATUS UPDATE
    if (req.body.status !== undefined) {
      policy.status = req.body.status;
    }

    const updated = await policy.save();

    res.json(updated);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Update failed",
    });
  }
});

// ================= DELETE =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user?.canAddPolicy) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const policy = await Policy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    // ✅ IMPORTANT SECURITY FIX
    if (policy.department.toString() !== user.department.toString()) {
      return res.status(403).json({ message: "Wrong department" });
    }

    await policy.deleteOne();

    res.json({ message: "Deleted successfully" });

  }catch (err) {
  console.log(err.response?.data || err.message);
  alert(err.response?.data?.message || "❌ Delete failed");
}
});

// ✅ MUST BE LAST LINE
module.exports = router;