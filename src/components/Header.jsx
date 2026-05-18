import React from "react";
import { Calendar, Shield, Users, Clock, AlertTriangle, Sun, Moon } from "lucide-react";

export default function Header({ currentUser, systemDate, activeCycle, onDateChange, theme, onToggleTheme }) {
  const formatFriendlyDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <header className="glass-panel" style={{ borderRadius: "0 0 var(--radius-md) var(--radius-md)", padding: "16px 28px", borderTop: "none", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", flexShrink: 0 }}>
      {/* User Welcome Block */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "36px" }}>{currentUser.avatar}</span>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700" }}>Welcome back, {currentUser.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)", padding: "2px 8px", borderRadius: "4px", fontWeight: "500" }}>
              {currentUser.title}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--color-success)" }}>
              <Shield size={12} />
              <span>Microsoft Entra ID Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time Simulator Widget & Theme Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        
        <div className="glass-panel" style={{ padding: "12px 18px", border: "1px dashed var(--color-brand)", backgroundColor: "rgba(255, 90, 31, 0.04)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600" }}>
              <Calendar size={14} className="text-brand" style={{ color: "var(--color-brand)" }} />
              <span>Time-Travel Date Simulator</span>
            </div>
            <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "var(--font-display)" }}>
              {formatFriendlyDate(systemDate)}
            </span>
          </div>

          {/* Date Selector Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <select 
              value={systemDate} 
              onChange={(e) => onDateChange(e.target.value)}
              className="form-select"
              style={{ padding: "6px 12px", fontSize: "12px", width: "auto", minWidth: "180px", cursor: "pointer", backgroundColor: "var(--bg-primary)" }}
            >
              <option value="2026-05-15">May 15 (Goal Creation)</option>
              <option value="2026-07-20">July 20 (Q1 Check-in)</option>
              <option value="2026-10-15">October 15 (Q2 Check-in)</option>
              <option value="2026-01-10">January 10 (Q3 Check-in)</option>
              <option value="2026-03-25">March 25 (Q4/Annual Review)</option>
            </select>
          </div>

          {/* Active Window Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderLeft: "1px solid var(--border-color)", paddingLeft: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Active Cycle</span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-brand)" }}>{activeCycle.name}</span>
            </div>
          </div>
        </div>

        {/* Theme toggle directly embedded inside flex container to avoid overlap issues */}
        {onToggleTheme && (
          <button 
            onClick={onToggleTheme} 
            className="btn btn-secondary" 
            style={{ 
              borderRadius: "9999px", 
              width: "42px", 
              height: "42px", 
              padding: 0, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              borderColor: "var(--border-color)",
              flexShrink: 0
            }}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

      </div>
    </header>
  );
}

