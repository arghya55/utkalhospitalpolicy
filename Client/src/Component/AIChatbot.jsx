import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { api } from "../api";

import "./AIChatbot.css";

const AIChatbot = () => {

  const [messages, setMessages] =
    useState([
      {
        type: "bot",
        text:
          "Hello! Ask me about SOP or Policies.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  // ================= SEND MESSAGE =================

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      type: "user",
      text: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const res =
        await api.post(
          "/chatbot/chat",
          {
            message: input,
          }
        );

      const botMessage = {
        type: "bot",
        text: res.data.answer,
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
            "Server error",
        },
      ]);

    } finally {

      setLoading(false);

      setInput("");
    }
  };

  // ================= VOICE INPUT =================

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

    recognition.lang = "en-IN";

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

      <div className="chatbot-header">
        UtkalTree AI Assistant
      </div>

      <div className="chatbot-messages">

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
            Typing...
          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      <div className="chatbot-input-area">

        <input
          type="text"
          placeholder="Ask SOP or Policy"
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

        <button
          onClick={startVoice}
        >
          🎤
        </button>

        <button
          onClick={sendMessage}
        >
          Send
        </button>

      </div>

    </div>
  );
};

export default AIChatbot;