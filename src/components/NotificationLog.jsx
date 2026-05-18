import React, { useState } from "react";
import { Mail, MessageSquare, Send, BellRing, Inbox, Target } from "lucide-react";

export default function NotificationLog({ notifications, onShowToast }) {
  const [activeTab, setActiveTab] = useState("TEAMS");

  const filtered = notifications.filter(n => n.type === activeTab);

  return (
    <div className="glass-panel animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", minHeight: "600px" }}>
      
      {/* Title Header */}
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <BellRing size={20} className="text-brand" style={{ color: "var(--color-brand)" }} />
          <span>Integration & Notifications Hub</span>
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Observe real-time Microsoft Teams Adaptive Cards and automated HTML email logs triggered by workflow events.
        </p>
      </div>

      {/* Integration Toggle tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("TEAMS")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: activeTab === "TEAMS" ? "1px solid var(--color-brand)" : "1px solid var(--border-color)",
            backgroundColor: activeTab === "TEAMS" ? "var(--color-brand-glow)" : "var(--bg-tertiary)",
            color: activeTab === "TEAMS" ? "var(--text-primary)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all var(--transition-fast)"
          }}
        >
          <MessageSquare size={16} />
          <span>Simulated Microsoft Teams Bot</span>
        </button>

        <button
          onClick={() => setActiveTab("EMAIL")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: activeTab === "EMAIL" ? "1px solid var(--color-brand)" : "1px solid var(--border-color)",
            backgroundColor: activeTab === "EMAIL" ? "var(--color-brand-glow)" : "var(--bg-tertiary)",
            color: activeTab === "EMAIL" ? "var(--text-primary)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all var(--transition-fast)"
          }}
        >
          <Mail size={16} />
          <span>Simulated Outlook Inbox</span>
        </button>
      </div>

      {/* List notifications */}
      {filtered.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justify: "center", gap: "12px", padding: "60px 0", color: "var(--text-muted)", flex: 1 }}>
          <Inbox size={48} strokeWidth={1} />
          <p style={{ fontStyle: "italic", fontSize: "14px" }}>
            No simulated notifications triggered yet. Submit a goal sheet or log achievements to fire webhook triggers!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {filtered.map(notif => {
            return (
              <div key={notif.id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                
                {/* Timestamp */}
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Triggered at {new Date(notif.timestamp).toLocaleString()} | Target Recipient: {notif.recipient}
                </span>

                {activeTab === "TEAMS" ? (
                  /* Teams Adaptive Card Display style */
                  <div 
                    style={{
                      maxWidth: "500px",
                      background: "hsl(222, 20%, 15%)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                      overflow: "hidden"
                    }}
                  >
                    {/* Header */}
                    <div style={{ backgroundColor: "#5b5fc7", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "9999px", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Target size={12} color="#5b5fc7" />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "white" }}>Atomberg HR Goal Bot</span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "700", color: "white" }}>
                        {notif.title}
                      </h4>
                      <div style={{ color: "var(--text-secondary)", whiteSpace: "pre-line", fontFamily: "monospace", fontSize: "12px", backgroundColor: "var(--bg-primary)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                        {notif.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Outlook Email Display style */
                  <div 
                    style={{
                      maxWidth: "800px",
                      background: "white",
                      color: "#333",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      overflow: "hidden"
                    }}
                  >
                    {/* Email Header */}
                    <div style={{ backgroundColor: "#0078d4", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Mail size={16} color="white" />
                        <span style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>Outlook Mailer Delivery Simulator</span>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>Delivered</span>
                    </div>

                    {/* Subject line */}
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #eee", fontSize: "13px", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span><strong>From</strong>: People Operations Core (no-reply@atomberg.com)</span>
                      <span><strong>To</strong>: {notif.recipient}</span>
                      <span><strong>Subject</strong>: <strong style={{ color: "#0078d4" }}>{notif.title}</strong></span>
                    </div>

                    {/* HTML Content Body */}
                    <div 
                      style={{ padding: "24px 20px", fontSize: "14px", lineHeight: "1.6" }}
                      dangerouslySetInnerHTML={{ __html: notif.content }}
                    />
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
