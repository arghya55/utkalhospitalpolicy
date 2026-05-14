const Policy = require("../models/Policy");
const Sop = require("../models/sop");

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message || !message.trim()) {

      return res.status(400).json({
        success: false,
        answer: "Message required",
      });
    }

    // LOWERCASE SEARCH
    const searchText =
      message.trim().toLowerCase();

    // GET ALL RECORDS
    const policies =
      await Policy.find({})
      .populate("department", "name");

    const sops =
      await Sop.find({})
      .populate("department", "name");

    // MERGE ALL
    const allDocs = [
      ...policies,
      ...sops,
    ];

    console.log(
      "TOTAL DOCS:",
      allDocs.length
    );

    // FILTER MATCH
    const matchedDocs =
      allDocs.filter((doc) => {

        const title =
          doc.title?.toLowerCase() || "";

        const description =
          doc.description?.toLowerCase() || "";

        return (
          title.includes(searchText) ||
          description.includes(searchText)
        );
      });

    console.log(
      "MATCHED:",
      matchedDocs.length
    );

    // NO MATCH
    if (matchedDocs.length === 0) {

      return res.json({
        success: true,
        answer:
          "Policy/SOP not found in hospital records.",
      });
    }

    // RESPONSE
    const answer =
      matchedDocs.map((doc, index) => `

${index + 1}. ${doc.title}

${doc.description}

Department:
${doc.department?.name || "N/A"}

`).join("\n");

    return res.json({
      success: true,
      answer,
    });

  } catch (error) {

    console.log(
      "CHATBOT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      answer: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  chatbot,
};