
// export default Home;
import React, { useEffect, useState } from "react";
import './UtkalTree.css'; // See the CSS file below
// import treeImage from '../assets/utkal-tree.png'; // Make sure to add a tree image in this path
import AIChatbot from "./AIChatbot";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isWatering, setIsWatering] = useState(false);

  // Original Logic: Sync user state from sessionStorage
  useEffect(() => {
    const loadedUser = () => {
      const storedUser = sessionStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadedUser(); 
    window.addEventListener("storage", loadedUser);
    window.addEventListener("focus", loadedUser);

    return () => {
      window.removeEventListener("storage", loadedUser);
      window.removeEventListener("focus", loadedUser);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null); 
    window.location.hash = "#/home";
  };

  const triggerWatering = () => {
    setIsWatering(true);
    // Animation duration
    setTimeout(() => setIsWatering(false), 3000);
  };

  return (
    <div className={`tree-dashboard ${isWatering ? "active-watering" : ""}`}>
      {/* Background Layer (The Tree Image) */}


      <div className="tree-background">

        
        {/* Hanging Buttons Overlay */}
        <div className="hanging-system">
          
          {/* HMIS Button */}
          <div className="fruit-hook hmis" style={{ top: "40%", left: "15%" }}>
            <div className="fiber-string"></div>
            <a href="http://10.0.0.24:300/LoginNova.aspx" target="_blank" rel="noopener noreferrer" className="glass-fruit">
              <span className="fruit-icon">🏥</span>
              <span className="fruit-label">UTKAL HMIS</span>
            </a>
          </div>

          {/* Website Button */}
          <div className="fruit-hook website" style={{ top: "55%", left: "25%" }}>
            <div className="fiber-string"></div>
            <a href="https://utkalhospital.com/" target="_blank" rel="noopener noreferrer" className="glass-fruit">
              <span className="fruit-icon">🌐</span>
              <span className="fruit-label">UTKAL WEBSITE</span>
            </a>
          </div>

          {/* QMS Button */}
          <div className="fruit-hook qms" style={{ top: "35%", left: "38%" }}>
            <div className="fiber-string"></div>
            <a href="http://10.0.0.25" target="_blank" rel="noopener noreferrer" className="glass-fruit">
              <span className="fruit-icon">📊</span>
              <span className="fruit-label">UTKAL QMS</span>
            </a>
          </div>

          {/* Login/Logout (Conditional) */}
          <div className="fruit-hook auth" style={{ top: "48%", left: "58%" }}>
            <div className="fiber-string glowing"></div>
            {!user ? (
              <button className="glass-fruit primary" onClick={() => (window.location.hash = "#/login")}>
                <span className="fruit-icon">🔑</span>
                <span className="fruit-label">USER LOGIN</span>
              </button>
            ) : (
              <button className="glass-fruit primary logout" onClick={handleLogout}>
                <span className="fruit-icon">🚪</span>
                <span className="fruit-label">USER LOGOUT</span>
              </button>
            )}
          </div>

          {/* PACS Button */}
          <div className="fruit-hook pacs" style={{ top: "35%", left: "68%" }}>
            <div className="fiber-string"></div>
            <a href="https://10.0.0.12/" target="_blank" rel="noopener noreferrer" className="glass-fruit">
              <span className="fruit-icon">🎞️</span>
              <span className="fruit-label">UTKAL PACS</span>
            </a>
          </div>

          {/* Policy Button */}
          <div className="fruit-hook policy" style={{ top: "52%", left: "73%" }}>
            <div className="fiber-string"></div>
            <button className="glass-fruit" onClick={() => (window.location.hash = "#/policy")}>
              <span className="fruit-icon">📖</span>
              <span className="fruit-label">SOP/POLICY</span>
            </button>
          </div>

          {/* Chatbot Button */}
          <div className="fruit-hook chatbot" style={{ top: "35%", left: "85%" }}>
            <div className="fiber-string"></div>
            <button className="glass-fruit" onClick={() => (window.location.hash = "#/chatbot")}>
              <span className="fruit-icon">🤖</span>
              <span className="fruit-label">AI CHATBOT</span>
            </button>
          </div>
        </div>

        {/* Watering Mechanic */}
        <div className="watering-area">
          <button className="water-btn" onClick={triggerWatering} disabled={isWatering}>
            {isWatering ? "🌧️ NURTURING..." : "💧 GIVE WATER"}
          </button>
          {isWatering && <div className="rain-drops">💧 💧 💧</div>}
        </div>

        <div className="footer-tagline">NURTURE THE GROWTH - GIVE WATER</div>
      </div>
    </div>
  );
};

export default Home;