const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY;

console.log(
  "GEMINI KEY EXISTS:",
  !!apiKey
);

const genAI =
  new GoogleGenerativeAI(apiKey);

const askAI = async (prompt) => {

  try {

    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    return response;

  } catch (error) {

    console.log(
      "🔥 GEMINI FULL ERROR:"
    );

    console.log(error);

    return "AI service temporarily unavailable.";
  }
};

module.exports = {
  askAI,
};