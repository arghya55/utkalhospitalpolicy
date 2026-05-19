const Sop = require("../models/sop");

exports.reorderSops = async (req, res) => {
  try {

    const { items } = req.body;

    for (let i = 0; i < items.length; i++) {

      await Sop.findByIdAndUpdate(
        items[i]._id,
        { order: i }
      );
    }

    res.json({
      success: true,
      message: "SOP Order Updated",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};