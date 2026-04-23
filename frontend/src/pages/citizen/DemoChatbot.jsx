import React, { useState, useRef, useEffect } from 'react';

const QUICK_REPLIES = [
  { id: 'apply', label: 'How do I apply for a scheme?' },
  { id: 'upload', label: 'How do I upload documents?' },
  { id: 'track', label: 'How do I track my application status?' },
  { id: 'docs', label: 'What documents are valid for upload?' },
];

const BOT_ANSWERS = {
  apply:
    'To apply for a scheme, go to "Browse Schemes" from the sidebar, find a scheme that matches your eligibility, and click the "Apply" button. Fill in the required details and submit your application!',
  upload:
    'To upload documents, visit "My Documents" from the sidebar. Click "Upload Document", choose a document type (e.g., Aadhaar, Income Certificate), then select your file and hit Upload. Your documents are saved in your secure vault for reuse.',
  track:
    'You can track your application status under "Track Applications" in the sidebar. Each application shows a timeline with the current status — Pending, Under Review, Approved, or Rejected.',
  docs:
    'Currently valid document types are: Aadhaar Card, PAN Card, Income Certificate, Caste Certificate, Residence Proof, and Bank Passbook. Make sure to upload clear, legible scans in PDF or image format.',
};

const BOT_WELCOME = "👋 Hi! I'm your welfare assistant. How can I help you today?";

const DemoChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: Date.now(), sender: 'bot', text: BOT_WELCOME },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleQuickReply = (reply) => {
    if (isTyping) return;

    // Append user message
    const userMsg = { id: Date.now(), sender: 'user', text: reply.label };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: BOT_ANSWERS[reply.id],
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <style>{`
        /* ---------- Floating Action Button ---------- */
        .chatbot-fab {
          position: fixed;
          bottom: 32px;
          left: 32px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.45);
          z-index: 1000;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: fabPulse 2.5s ease-in-out infinite;
        }
        .chatbot-fab:hover {
          transform: scale(1.12);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.6);
          animation: none;
        }
        @keyframes fabPulse {
          0%   { box-shadow: 0 8px 30px rgba(37, 99, 235, 0.45); }
          50%  { box-shadow: 0 8px 40px rgba(124, 58, 237, 0.7); }
          100% { box-shadow: 0 8px 30px rgba(37, 99, 235, 0.45); }
        }

        /* ---------- Modal Wrapper ---------- */
        .chatbot-modal-wrapper {
          position: fixed;
          bottom: 108px;
          left: 32px;
          z-index: 1001;
          transform-origin: bottom left;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.25s ease;
        }
        .chatbot-modal-wrapper.open {
          transform: scale(1);
          opacity: 1;
          pointer-events: auto;
        }
        .chatbot-modal-wrapper.closed {
          transform: scale(0.6);
          opacity: 0;
          pointer-events: none;
        }

        /* ---------- Chat Window ---------- */
        .chatbot-window {
          width: 360px;
          max-height: 520px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ---------- Header ---------- */
        .chatbot-header {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chatbot-avatar {
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .chatbot-header-text h4 {
          margin: 0;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
        }
        .chatbot-header-text p {
          margin: 2px 0 0;
          color: rgba(255,255,255,0.75);
          font-size: 12px;
        }
        .chatbot-close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: #fff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          line-height: 1;
        }
        .chatbot-close-btn:hover {
          background: rgba(255,255,255,0.35);
        }

        /* ---------- Messages ---------- */
        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #f8fafc;
          min-height: 0;
          max-height: 300px;
        }
        .chatbot-messages::-webkit-scrollbar {
          width: 4px;
        }
        .chatbot-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          animation: slideUp 0.25s ease forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chat-bubble.bot {
          background: #ffffff;
          color: #1e293b;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .chat-bubble.user {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
          border-bottom-right-radius: 4px;
          align-self: flex-end;
        }

        /* ---------- Typing Indicator ---------- */
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 12px 16px;
          background: #ffffff;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          align-self: flex-start;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          animation: slideUp 0.25s ease forwards;
        }
        .typing-dot {
          width: 7px;
          height: 7px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typingBounce 1s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.30s; }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }

        /* ---------- Quick Replies ---------- */
        .chatbot-quick-replies {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }
        .chatbot-quick-replies p {
          margin: 0 0 4px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .quick-reply-btn {
          background: #f1f5f9;
          border: 1.5px solid #e2e8f0;
          color: #334155;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .quick-reply-btn:hover {
          background: #ede9fe;
          border-color: #7c3aed;
          color: #7c3aed;
          transform: translateX(3px);
        }
        .quick-reply-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      {/* Floating Action Button */}
      <button
        id="chatbot-fab-btn"
        className="chatbot-fab"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        title="Welfare Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Modal */}
      <div className={`chatbot-modal-wrapper ${isOpen ? 'open' : 'closed'}`}>
        <div className="chatbot-window" role="dialog" aria-label="Welfare Assistant Chatbot">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-header-text">
                <h4>Welfare Assistant</h4>
                <p>Ask me anything about schemes</p>
              </div>
            </div>
            <button
              id="chatbot-close-btn"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {!isTyping && (
            <div className="chatbot-quick-replies">
              <p>Quick Questions</p>
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.id}
                  id={`quick-reply-${reply.id}`}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                  disabled={isTyping}
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DemoChatbot;
