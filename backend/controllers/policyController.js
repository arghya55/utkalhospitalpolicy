const Policy = require("../models/Policy");

exports.reorderPolicies = async (req, res) => {
  try {

    const { items } = req.body;

    for (let i = 0; i < items.length; i++) {

      await Policy.findByIdAndUpdate(
        items[i]._id,
        { order: i }
      );
    }

    res.json({
      success: true,
      message: "Order Updated",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};