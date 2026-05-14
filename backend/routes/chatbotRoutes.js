const express = require("express");

const {
  chatbot,
} = require(
  "../controllers/chatbotController"
);

const router = express.Router();

router.post("/chat", chatbot);

module.exports = router;