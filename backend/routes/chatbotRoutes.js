const express = require("express");

const router = express.Router();

const {
  chatbot,
  getSuggestions,
} = require("../controllers/chatbotController");

router.post(
  "/chat",
  chatbot
);

router.get(
  "/suggestions",
  getSuggestions
);

module.exports = router;