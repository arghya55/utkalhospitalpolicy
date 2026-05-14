const Policy = require("../models/Policy");
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

    const docs = await Policy.find({
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

    if (docs.length === 0) {

      return res.json({
        success: true,
        answer:
          "Policy/SOP not found in hospital records.",
      });
    }

    const context = docs
      .map(
        (d, index) => `
Document ${index + 1}
Title: ${d.title}
Description: ${d.description}
`
      )
      .join("\n");

    const prompt = `
You are an official hospital SOP assistant.

Answer ONLY from provided hospital records.

Hospital Records:
${context}

User Question:
${message}
`;

    const aiAnswer =
      await askAI(prompt);

    return res.json({
      success: true,
      answer: aiAnswer,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatbot,
};