const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const askAI = async (prompt) => {

  try {

    console.log(
      "GEMINI API KEY:",
      process.env.GEMINI_API_KEY
    );

    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text();

    console.log(
      "GEMINI RESPONSE:",
      text
    );

    return text;

  } catch (error) {

    console.log(
      "FULL GEMINI ERROR:"
    );

    console.log(error);

    if (error.response) {
      console.log(
        error.response.data
      );
    }

    return "AI service temporarily unavailable.";
  }
};

module.exports = {
  askAI,
};