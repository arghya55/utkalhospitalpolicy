const Policy = require("../models/Policy");
const Sop = require("../models/sop");

const { askAI } =
require("../services/aiServices");

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    // GET ALL RECORDS
    const policies =
      await Policy.find().limit(100);

    const sops =
      await Sop.find().limit(100);

    // MERGE ALL
    const allDocs = [
      ...policies,
      ...sops,
    ];

    // NOTHING
    if (allDocs.length === 0) {

      return res.json({
        success: true,
        answer:
          "No hospital SOP or policy records found.",
      });
    }

    // CREATE CONTEXT
    const context = allDocs.map(
      (d, index) => `

Document ${index + 1}

Title:
${d.title}

Description:
${d.description}

`
    ).join("\n");

    // AI SEARCH PROMPT
    const prompt = `

You are an AI hospital SOP assistant.

Your job is:

1. Understand the user's meaning semantically.
2. Find the most relevant SOP/policy from records.
3. Even if exact keywords do not match,
   try to understand intent.
4. Answer ONLY from hospital records.
5. If no relevant document exists,
   say:
   "Information not available in hospital records."

Hospital Records:
${context}

User Question:
${message}

`;

    // GEMINI RESPONSE
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