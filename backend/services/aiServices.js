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

    const response =
      result.response.text();

    return response;

  } catch (error) {

    console.log(
      "GEMINI ERROR:",
      error.message
    );

    return "AI service unavailable.";
  }
};

module.exports = askAI;