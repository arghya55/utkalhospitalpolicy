const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const askAI = async (prompt) => {

  try {

    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const result =
      await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {

    console.log(
      "GEMINI ERROR:",
      error.message
    );

    if (
      error.message.includes("API key")
    ) {
      return "Invalid Gemini API key.";
    }

    if (
      error.message.includes("quota")
    ) {
      return "Gemini quota exceeded.";
    }

    return "AI service temporarily unavailable.";
  }
};

module.exports = {
  askAI,
};