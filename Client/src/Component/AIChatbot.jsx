import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { api } from "../api";

import "./AIChatbot.css";

const AIChatbot = () => {

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [suggestions, setSuggestions] =
    useState([]);

  const [popupText, setPopupText] =
    useState("");

  const [showPopup, setShowPopup] =
    useState(true);

  const [messageIndex, setMessageIndex] =
    useState(0);
    const [popupMessages, setPopupMessages] =
  useState([]);

  const messagesEndRef =
    useRef(null);

  // =========================================
  // AUTO SCROLL
  // =========================================

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  // =========================================
// LOAD POPUP MESSAGES
// =========================================

useEffect(() => {

  const fetchPopupMessages =
    async () => {

      try {

        const res =
          await api.get(
            "/chatbot/popup-messages"
          );

        setPopupMessages(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  fetchPopupMessages();

}, []);

  // =========================================
  // PREMIUM AI POPUP
  // =========================================

  useEffect(() => {

    let typingInterval;

    let hideTimeout;

    let nextTimeout;

    const currentText =

  popupMessages.length > 0

    ? popupMessages[
        messageIndex %
        popupMessages.length
      ]

    : "⌨️ Search Your All Departments Policies and Sops Data...";

    let charIndex = 0;

    setPopupText("");

    setShowPopup(true);

    typingInterval =
      setInterval(() => {

        setPopupText(
          currentText.slice(
            0,
            charIndex + 1
          )
        );

        charIndex++;

        if (
          charIndex >=
          currentText.length
        ) {

          clearInterval(
            typingInterval
          );

          hideTimeout =
            setTimeout(() => {

              setShowPopup(false);

            }, 3500);

          nextTimeout =
            setTimeout(() => {

              setMessageIndex(
                (prev) =>
                  (prev + 1) %
                  popupMessages.length
              );

            }, 7000);
        }

      }, 35);

    return () => {

      clearInterval(
        typingInterval
      );

      clearTimeout(
        hideTimeout
      );

      clearTimeout(
        nextTimeout
      );
    };

  }, [messageIndex, input]);

  // =========================================
  // LOAD SUGGESTIONS
  // =========================================

  useEffect(() => {

    const fetchSuggestions =
      async () => {

        if (!input.trim()) {

          setSuggestions([]);

          return;
        }

        try {

          const res =
            await api.get(
              `/chatbot/suggestions?query=${input}`
            );

          setSuggestions(
            res.data
          );

        } catch (error) {

          console.log(error);
        }
      };

    fetchSuggestions();

  }, [input]);

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async (
    text = input
  ) => {

    if (!text.trim()) return;

    const userMessage = {
      type: "user",
      text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    setSuggestions([]);

    try {

      const res =
        await api.post(
          "/chatbot/chat",
          {
            message: text,
          }
        );

      const botMessage = {
        type: "bot",
        text:
          res.data.answer,
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (err) {

      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            "❌ Server Error",
        },
      ]);

    } finally {

      setLoading(false);

      setInput("");
    }
  };

  // =========================================
  // VOICE INPUT
  // =========================================

  const startVoice = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-IN";

    recognition.start();

    recognition.onresult =
      (event) => {

        setInput(
          event.results[0][0]
            .transcript
        );
      };
  };

  return (

    <div className="chatbot-container">

    

      {/* ================= HEADER ================= */}

      <div className="chatbot-header">

        <button
          className="backchat-home-btn"
          onClick={() =>
            (window.location.hash =
              "#/home")
          }
        >
          ← Home
        </button>
  {/* ================= AI POPUP ================= */}

      {showPopup && (

        <div className="ai-popup">

          <div className="popup-glow"></div>

          <div className="popup-header">

            🤖 UtkalTree AI

            <span className="live-dot"></span>

          </div>

          <div className="popup-text">

            {popupText}

            <span className="typing-cursor">
              |
            </span>

          </div>

        </div>
      )}
        

        <button
          className="chatlogoutbtn"
          onClick={() => {

            localStorage.clear();

            sessionStorage.clear();

            window.location.hash =
              "#/";
          }}
        >
          Logout
        </button>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div className="chatbot-messages">

        {messages.length === 0 && (

          <div className="empty-chat">

            <div className="empty-icon">
              🤖
            </div>

            <h2>
              Welcome To UtkalTree AI
            </h2>

            <p>
              Ask anything about
              SOPs, Policies Instantly
            </p>

          </div>
        )}

        {messages.map(
          (msg, index) => (

            <div
              key={index}
              className={`message ${msg.type}`}
            >

              {msg.text
                .split("\n")
                .map((line, i) => (

                  <p key={i}>
                    {line}
                  </p>
              ))}

            </div>
          )
        )}

        {loading && (

          <div className="message bot">

            <div className="typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* ================= INPUT AREA ================= */}

      <div className="chatbot-input-area">

        <div className="input-wrapper">

          <input
            type="text"
            placeholder="Search SOPs, Policies..."
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }

            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {

                sendMessage();
              }
            }}
          />

          {/* ================= SUGGESTIONS ================= */}

          {suggestions.length >
            0 && (

            <div className="suggestion-box">

              {suggestions.map(
                (
                  suggestion,
                  index
                ) => (

                  <div
                    key={index}
                    className="suggestion-item"

                    onClick={() =>
                      sendMessage(
                        suggestion
                      )
                    }
                  >
                    🔍 {suggestion}
                  </div>
                )
              )}

            </div>
          )}

        </div>

        <button
          className="voice-btn"
          onClick={startVoice}
        >
          🎤
        </button>

        <button
          className="send-btn"
          onClick={() =>
            sendMessage()
          }
        >
          ➤
        </button>

      </div>

    </div>
  );
};

export default AIChatbot;