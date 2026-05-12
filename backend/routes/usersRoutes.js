const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  

// CREATE USER
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
       canAddPolicy: req.body.canAddPolicy || false
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET USERS (with department)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("department");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    // password change করলে hash হবে
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    } else {
      delete updateData.password;
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        canAddPolicy: req.body.canAddPolicy || false
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USER LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ employeeId: req.body.employeeId }).populate("department");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        department: user.department._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
            department: user.department?._id,     
    departmentName: user.department?.name,
        canAddPolicy: user.canAddPolicy,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;