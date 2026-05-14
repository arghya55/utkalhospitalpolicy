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

    // USER INPUT
    const searchWords =
      message
        .toLowerCase()
        .split(" ")
        .filter(Boolean);

    // GET ALL RECORDS
    const policies =
      await Policy.find({})
      .populate("department", "name");

    const sops =
      await Sop.find({})
      .populate("department", "name");

    // MERGE
    const allDocs = [
      ...policies,
      ...sops,
    ];

    console.log(
      "TOTAL DOCS:",
      allDocs.length
    );

    // SMART FILTER
    const matchedDocs =
      allDocs.filter((doc) => {

        const title =
          (doc.title || "")
          .toLowerCase();

        const description =
          (doc.description || "")
          .toLowerCase();

        const combined =
          `${title} ${description}`;

        // MATCH ANY WORD
        return searchWords.some(
          (word) =>
            combined.includes(word)
        );
      });

    console.log(
      "MATCHED DOCS:",
      matchedDocs.length
    );

    // NOTHING FOUND
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