const Policy =
  require("../models/Policy");

const Sop =
  require("../models/sop");

const {
  askAI,
} = require("../services/aiServices");

const chatbot = async (
  req,
  res
) => {

  try {

    const { message } =
      req.body;

    if (!message) {

      return res.status(400)
      .json({
        success: false,
        message:
          "Message required",
      });
    }

    // GET DATA
    const policies =
      await Policy.find()
      .limit(100);

    const sops =
      await Sop.find()
      .limit(100);

    const allDocs = [
      ...policies,
      ...sops,
    ];

    // SEARCH
    const matchedDocs =
      allDocs.filter((doc) => {

        const text = `
          ${doc.title}
          ${doc.description}
        `.toLowerCase();

        return text.includes(
          message.toLowerCase()
        );
      });

    // NOTHING FOUND
    if (
      matchedDocs.length === 0
    ) {

      return res.json({
        success: true,
        answer:
          "Policy/SOP not found in hospital records.",
      });
    }

    // CONTEXT
    const context =
      matchedDocs.map(
        (d, index) => `

Document ${index + 1}

Title:
${d.title}

Description:
${d.description}

`
      ).join("\n");

    // TRY AI
    let aiAnswer;

    try {

      const prompt = `

You are a hospital SOP assistant.

Answer professionally
using ONLY hospital records.

Hospital Records:
${context}

User Question:
${message}

`;

      aiAnswer =
        await askAI(prompt);

    } catch (err) {

      console.log(
        "AI FAILED"
      );

      aiAnswer = context;
    }

    // FINAL RESPONSE
    return res.json({
      success: true,
      answer: aiAnswer,
    });

  } catch (error) {

    console.log(
      "CHATBOT ERROR:",
      error
    );

    return res.status(500)
    .json({
      success: false,
      message:
        "Server error",
    });
  }
};

module.exports = {
  chatbot,
};