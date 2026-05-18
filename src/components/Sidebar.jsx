import React from "react";
import { 
  Target, 
  CheckSquare, 
  Share2, 
  BarChart3, 
  ShieldAlert, 
  Mail, 
  UserSquare2, 
  LogOut, 
  Layers
} from "lucide-react";

export default function Sidebar({ 
  currentUser, 
  users, 
  activeTab, 
  setActiveTab, 
  onUserSwitch,
  onLogout
}) {
  const menuItems = [
    { id: "my-goals", label: "My Goal Sheet", icon: Target, roles: ["Employee"] },
    { id: "my-checkins", label: "Quarterly Check-ins", icon: CheckSquare, roles: ["Employee"] },
    { id: "team-dashboard", label: "Team Approvals", icon: Layers, roles: ["Manager", "Admin"] },
    { id: "shared-goals", label: "KPI Cascadings", icon: Share2, roles: ["Manager", "Admin"] },
    { id: "analytics", label: "Analytics & Trends", icon: BarChart3, roles: ["Admin", "Manager"] },
    { id: "escalations", label: "Governance & Audit", icon: ShieldAlert, roles: ["Admin"] },
    { id: "notifications", label: "Notification Hub", icon: Mail, roles: ["Employee", "Manager", "Admin"] }
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside style={{ backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, width: "260px", flexShrink: 0 }}>
      {/* Brand Logo Header */}
      <div style={{ padding: "28px 24px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--color-brand)", display: "flex", alignItems: "center", justify: "center", boxShadow: "0 0 15px var(--color-brand-glow)" }}>
          <Target size={20} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "0.03em", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            atomberg
          </h2>
          <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-brand)", fontWeight: "700", letterSpacing: "0.05em" }}>
            Goal Portal v1
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: "24px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
        {filteredMenu.map(item => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: "500",
                fontSize: "14px",
                textAlign: "left",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                backgroundColor: isActive ? "var(--color-brand-glow)" : "transparent",
                borderLeft: isActive ? "3px solid var(--color-brand)" : "3px solid transparent",
                transition: "all var(--transition-fast)"
              }}
            >
              <IconComponent size={18} style={{ color: isActive ? "var(--color-brand)" : "var(--text-muted)" }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Action Area */}
      {onLogout && (
        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "0 16px 12px 16px",
            padding: "10px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-danger)",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            color: "var(--color-danger)",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all var(--transition-fast)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-danger)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
            e.currentTarget.style.color = "var(--color-danger)";
          }}
        >
          <LogOut size={15} />
          <span>Exit App Session</span>
        </button>
      )}

      {/* Identity Sandbox Panel (Hidden for standard Employees and Managers, Admin access only) */}
      {currentUser.role === "Admin" && (
        <div className="glass-panel" style={{ margin: "0 16px 16px 16px", padding: "12px", borderStyle: "solid", borderWidth: "1px", borderColor: "var(--border-color)", borderRadius: "var(--radius-md)" }}>
          <h4 style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--color-brand)", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "6px" }}>
            <UserSquare2 size={12} />
            <span>Quick Role Switcher</span>
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {users.map(u => {
              const isActive = currentUser.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onUserSwitch(u.id)}
                  className={`demo-role-pill ${isActive ? 'active' : ''}`}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    fontSize: "11px",
                    border: isActive ? "1px solid var(--color-brand)" : "1px solid var(--border-color)",
                    backgroundColor: isActive ? "var(--color-brand-glow)" : "var(--bg-tertiary)",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px" }}>{u.avatar}</span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: "600" }}>{u.name}</span>
                      <span style={{ fontSize: "9px", color: isActive ? "var(--color-brand)" : "var(--text-muted)" }}>{u.role}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>

  );
}
