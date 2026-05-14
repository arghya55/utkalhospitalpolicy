const Policy =
  require("../models/Policy");

const Sop =
  require("../models/Sop");

const {
  askAI,
} = require("../services/aiService");

// NORMALIZE TEXT
const normalizeText = (text) => {

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "");
};

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const normalizedMessage =
      normalizeText(message);

    // GET RECORDS
    const policies =
      await Policy.find({
        status: "Active",
      }).limit(30);

    const sops =
      await Sop.find({
        status: "Active",
      }).limit(30);

    const allDocs = [
      ...policies,
      ...sops,
    ];

    // SMART SEARCH
    const matchedDocs =
      allDocs.filter((doc) => {

        const combinedText =
          normalizeText(
            `
            ${doc.title || ""}
            ${doc.description || ""}
            `
          );

        return normalizedMessage
          .split(" ")
          .every((word) =>
            combinedText.includes(word)
          );
      });

    // NO MATCH
    if (matchedDocs.length === 0) {

      return res.json({
        success: true,
        answer:
          "Information not available in hospital records.",
      });
    }

    // CONTEXT
    const context =
      matchedDocs.map((d, index) => `

Document ${index + 1}

Title:
${d.title}

Description:
${(d.description || "").slice(0, 400)}

`).join("\n");

    // AI PROMPT
    const prompt = `

You are Utkal Hospital AI SOP Assistant.

Rules:

1. Answer ONLY from hospital records.
2. Keep answer short and professional.
3. Mention SOP/Policy title.
4. If not found say:
"Information not available in hospital records."

Hospital Records:
${context}

User Question:
${message}

`;

    // GEMINI
    const aiAnswer =
      await askAI(prompt);

    return res.json({
      success: true,
      answer: aiAnswer,
    });

  } catch (error) {

    console.log(
      "CHATBOT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatbot,
};