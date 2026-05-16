const express = require("express");

const router = express.Router();

const {
  chatbot,
  getSuggestions,
  getPopupMessages
} = require("../controllers/chatbotController");

router.post(
  "/chat",
  chatbot
);

router.get(
  "/suggestions",
  getSuggestions
);
router.get(
  "/popup-messages",
  getPopupMessages
);

module.exports = router;