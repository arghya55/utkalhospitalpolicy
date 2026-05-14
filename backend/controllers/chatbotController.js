const Policy = require("../models/Policy");
const Sop = require("../models/Sop");

const { askAI } = require("../services/aiServices");

const chatbot = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {

      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    // SEARCH POLICIES
    const policies = await Policy.find({

      $or: [

        {
          title: {
            $regex: message,
            $options: "i",
          },
        },

        {
          description: {
            $regex: message,
            $options: "i",
          },
        },

      ],

    }).limit(5);

    // SEARCH SOPS
    const sops = await Sop.find({

      $or: [

        {
          title: {
            $regex: message,
            $options: "i",
          },
        },

        {
          description: {
            $regex: message,
            $options: "i",
          },
        },

      ],

    }).limit(5);

    // MERGE
    const docs = [
      ...policies,
      ...sops,
    ];

    // NOTHING FOUND
    if (docs.length === 0) {

      return res.json({
        success: true,
        answer:
          "Policy/SOP not found in hospital records.",
      });
    }

    // CONTEXT
    const context = docs.map((d, index) => `

Document ${index + 1}

Title: ${d.title}

Description: ${d.description}

`).join("\n");

    // AI PROMPT
    const prompt = `

You are a hospital SOP assistant.

Answer ONLY from the hospital records below.

Hospital Records:
${context}

User Question:
${message}

`;

    // GEMINI
    const aiAnswer = await askAI(prompt);

    return res.json({
      success: true,
      answer: aiAnswer,
    });

  } catch (error) {

    console.log("CHATBOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatbot,
};