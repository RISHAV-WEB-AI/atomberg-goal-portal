import React, { useState, useEffect } from "react";
import { 
  initializeStore,
  getUsers, 
  getGoals, 
  getSheets, 
  getAudits, 
  getNotifications, 
  getSystemDate, 
  getActiveCycle, 
  getEscalations, 
  updateSystemDate, 
  saveGoalSheet, 
  submitGoalSheet, 
  updateEmployeeGoalInline, 
  approveGoalSheet, 
  unlockGoalSheet, 
  cascadeSharedGoal, 
  updateGoalAchievement, 
  saveManagerCheckinComment 
} from "./data/mockStore";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import GoalSheetEditor from "./components/GoalSheetEditor";
import TeamDashboard from "./components/TeamDashboard";
import CheckinManager from "./components/CheckinManager";
import SharedGoalManager from "./components/SharedGoalManager";
import AnalyticsPortal from "./components/AnalyticsPortal";
import EscalationView from "./components/EscalationView";
import NotificationLog from "./components/NotificationLog";
import LandingPage from "./components/LandingPage"; // Embedded Public Landing Page

import { Moon, Sun, Terminal, X, AlertOctagon, Lock } from "lucide-react";

export default function App() {
  // Theme state
  const [theme, setTheme] = useState("dark");

  // Core relational database states
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [audits, setAudits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [systemDate, setSystemDate] = useState("");
  const [activeCycle, setActiveCycle] = useState({});
  const [escalations, setEscalations] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState("my-goals");
  const [toasts, setToasts] = useState([]);
  const [showDemoConsole, setShowDemoConsole] = useState(false);

  // Sync relational database data to local state
  const reloadData = () => {
    const freshUsers = getUsers();
    const freshGoals = getGoals();
    const freshSheets = getSheets();
    const freshAudits = getAudits();
    const freshNotifs = getNotifications();
    const freshDate = getSystemDate();
    const freshCycle = getActiveCycle(freshDate);
    const freshEscalations = getEscalations();

    setUsers(freshUsers);
    setGoals(freshGoals);
    setSheets(freshSheets);
    setAudits(freshAudits);
    setNotifications(freshNotifs);
    setSystemDate(freshDate);
    setActiveCycle(freshCycle);
    setEscalations(freshEscalations);
  };

  // Run on mount - initialize store and restore logged session
  useEffect(() => {
    initializeStore();
    reloadData();
    
    const savedUserJson = localStorage.getItem("atomberg_auth_user");
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        const allUsers = getUsers();
        const verifiedUser = allUsers.find(u => u.id === savedUser.id);
        if (verifiedUser) {
          setCurrentUser(verifiedUser);
          if (verifiedUser.role === "Employee") {
            setActiveTab("my-goals");
          } else if (verifiedUser.role === "Manager") {
            setActiveTab("team-dashboard");
          } else if (verifiedUser.role === "Admin") {
            setActiveTab("analytics");
          }
        }
      } catch (e) {
        localStorage.removeItem("atomberg_auth_user");
      }
    }
  }, []);

  // Update theme tag in HTML document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Dynamic Toast trigger
  const showToast = (type, message) => {
    const id = `TOAST_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newToast = { id, type, message };
    setToasts(prev => [...prev, newToast]);
    
    // Auto clear after 4.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Mutation Handlers
  
  const handleSaveGoals = (userId, goalItems) => {
    saveGoalSheet(userId, goalItems);
    reloadData();
  };

  const handleSubmitGoals = (userId, goalItems) => {
    submitGoalSheet(userId, goalItems);
    reloadData();
    showToast("success", "Goal sheet submitted successfully!");
  };

  const handleInlineGoalEdit = (employeeId, goalId, fields) => {
    if (!currentUser) return;
    updateEmployeeGoalInline(employeeId, goalId, fields, currentUser);
    reloadData();
  };

  const handleApproveSheet = (employeeId, status, comment, managerUser) => {
    approveGoalSheet(employeeId, status, comment, managerUser);
    reloadData();
  };

  const handleUnlockSheet = (employeeId, adminUser) => {
    unlockGoalSheet(employeeId, adminUser);
    reloadData();
  };

  const handleCascadeKPI = (sourceGoalId, recipientUserIds, creatorUser) => {
    cascadeSharedGoal(sourceGoalId, recipientUserIds, creatorUser);
    reloadData();
  };

  const handleUpdateAchievement = (goalId, quarter, actualVal, statusVal, employeeUser) => {
    updateGoalAchievement(goalId, quarter, actualVal, statusVal, employeeUser);
    reloadData();
  };

  const handleSaveComment = (employeeId, quarter, comment, managerUser) => {
    saveManagerCheckinComment(employeeId, quarter, comment, managerUser);
    reloadData();
  };

  const handleDateChange = (newDate) => {
    updateSystemDate(newDate);
    reloadData();
    showToast("info", `System date traveled to: ${new Date(newDate).toLocaleDateString()}`);
  };

  const handleUserSwitch = (userId) => {
    const selected = users.find(u => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      localStorage.setItem("atomberg_auth_user", JSON.stringify(selected));
      showToast("success", `Azure AD SSO: Logged in as ${selected.name} (${selected.role})`);
      
      // Smart Tab redirect depending on new role's capabilities
      if (selected.role === "Employee") {
        setActiveTab("my-goals");
      } else if (selected.role === "Manager") {
        setActiveTab("team-dashboard");
      } else if (selected.role === "Admin") {
        setActiveTab("analytics");
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("atomberg_auth_user");
    showToast("info", "Corporate Session locked. Return to public portal.");
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  if (!currentUser) {
    return (
      <>
        <LandingPage 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            localStorage.setItem("atomberg_auth_user", JSON.stringify(user));
            // Direct to correct role landing page
            if (user.role === "Employee") {
              setActiveTab("my-goals");
            } else if (user.role === "Manager") {
              setActiveTab("team-dashboard");
            } else if (user.role === "Admin") {
              setActiveTab("analytics");
            }
          }}
          onShowToast={showToast}
        />
        {/* Toast notification overlay for landing page */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13.5px", fontWeight: "600" }}>{t.message}</span>
              <button 
                onClick={() => removeToast(t.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  const userSheet = sheets.find(s => s.userId === currentUser.id);

  // Strict double-layered RBAC guard backstop checks
  const isEmployeeTab = ["my-goals", "my-checkins"].includes(activeTab);
  const isManagementTab = ["team-dashboard", "shared-goals", "analytics", "escalations"].includes(activeTab);

  const isAccessViolation = 
    (currentUser.role === "Employee" && isManagementTab) ||
    (currentUser.role !== "Employee" && isEmployeeTab);

  const renderAccessViolation = () => (
    <div className="glass-panel" style={{ padding: "40px", margin: "40px auto", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center", border: "2px solid var(--color-danger)", backgroundColor: "rgba(239, 68, 68, 0.02)" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--color-danger)" }}>
        <Lock size={26} style={{ color: "var(--color-danger)" }} />
      </div>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "900", color: "var(--color-danger)", fontFamily: "var(--font-display)" }}>Strict Access Policy Violation</h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.6" }}>
          Your corporate authorization profile (<strong>{currentUser.role}</strong>) does not have read permissions for the <strong>{activeTab}</strong> tab segment. Employees cannot access manager portals, and managers/admins cannot impersonate direct employee editing workflows.
        </p>
      </div>
      <button 
        onClick={() => {
          if (currentUser.role === "Employee") {
            setActiveTab("my-goals");
          } else if (currentUser.role === "Manager") {
            setActiveTab("team-dashboard");
          } else {
            setActiveTab("analytics");
          }
        }} 
        className="btn btn-primary"
      >
        Return to Authorized Route
      </button>
    </div>
  );

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentUser={currentUser}
        users={users}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUserSwitch={handleUserSwitch}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <div className="main-content">
        
        {/* Topbar Welcome & Date Simulator Header */}
        <Header 
          currentUser={currentUser}
          systemDate={systemDate}
          activeCycle={activeCycle}
          onDateChange={handleDateChange}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Tab Routed Content Body */}
        <main className="content-body">
          {isAccessViolation ? (
            renderAccessViolation()
          ) : (
            <>
              {activeTab === "my-goals" && (
                <GoalSheetEditor 
                  currentUser={currentUser}
                  goals={goals}
                  sheet={userSheet}
                  onSave={handleSaveGoals}
                  onSubmit={handleSubmitGoals}
                  onShowToast={showToast}
                />
              )}

              {activeTab === "my-checkins" && (
                <CheckinManager 
                  currentUser={currentUser}
                  users={users}
                  goals={goals}
                  sheets={sheets}
                  activeCycle={activeCycle}
                  onUpdateAchievement={handleUpdateAchievement}
                  onSaveComment={handleSaveComment}
                  onShowToast={showToast}
                />
              )}

              {activeTab === "team-dashboard" && (
                <TeamDashboard 
                  currentUser={currentUser}
                  users={users}
                  goals={goals}
                  sheets={sheets}
                  onInlineGoalEdit={handleInlineGoalEdit}
                  onApproveSheet={handleApproveSheet}
                  onShowToast={showToast}
                />
              )}

              {activeTab === "shared-goals" && (
                <SharedGoalManager 
                  currentUser={currentUser}
                  users={users}
                  goals={goals}
                  onCascadeKPI={handleCascadeKPI}
                  onShowToast={showToast}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsPortal 
                  currentUser={currentUser}
                  users={users}
                  goals={goals}
                  sheets={sheets}
                  onShowToast={showToast}
                />
              )}

              {activeTab === "escalations" && (
                <EscalationView 
                  currentUser={currentUser}
                  users={users}
                  sheets={sheets}
                  audits={audits}
                  escalations={escalations}
                  onUnlockSheet={handleUnlockSheet}
                  onShowToast={showToast}
                />
              )}

              {activeTab === "notifications" && (
                <NotificationLog 
                  notifications={notifications}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Developer Sandbox Sandbox button */}
      <button 
        onClick={() => setShowDemoConsole(prev => !prev)}
        className="demo-console-toggle"
        title="Open Developer Sandbox Console"
      >
        <Terminal size={22} />
      </button>

      {/* Developer Sandbox Panel Drawer */}
      {showDemoConsole && (
        <div className="demo-console-panel animate-scale-in">
          <div className="demo-console-header">
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-brand)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Terminal size={15} />
              <span>Sandbox Interactive Tester</span>
            </h3>
            <button 
              onClick={() => setShowDemoConsole(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="demo-console-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              {/* Info block */}
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)", padding: "10px 12px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--color-brand)" }}>
                Use this console to instantly manipulate the environment parameters to test complex, multi-day appraisal scenarios.
              </div>

              {/* Time-Travel section */}
              <div>
                <h4 style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: "600", marginBottom: "8px" }}>Time Travel testing:</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button 
                    onClick={() => handleDateChange("2026-05-15")}
                    className="btn btn-secondary" style={{ padding: "6px", fontSize: "11px" }}
                  >
                    Goal Creation (May)
                  </button>
                  <button 
                    onClick={() => handleDateChange("2026-07-20")}
                    className="btn btn-secondary" style={{ padding: "6px", fontSize: "11px" }}
                  >
                    Q1 Check-in (July)
                  </button>
                  <button 
                    onClick={() => handleDateChange("2026-10-15")}
                    className="btn btn-secondary" style={{ padding: "6px", fontSize: "11px" }}
                  >
                    Q2 Check-in (Oct)
                  </button>
                  <button 
                    onClick={() => handleDateChange("2026-03-25")}
                    className="btn btn-secondary" style={{ padding: "6px", fontSize: "11px" }}
                  >
                    Q4/Annual (March)
                  </button>
                </div>
              </div>

              {/* Escalation triggers block */}
              <div>
                <h4 style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: "600", marginBottom: "8px" }}>Compliance Escalation Simulator:</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <button 
                    onClick={() => {
                      // Travell to May 26 to trigger employee non-submission escalations
                      handleDateChange("2026-05-26");
                      showToast("warning", "Escalation engine evaluated: May 25 Goal setting deadline breached!");
                    }}
                    className="btn btn-secondary" 
                    style={{ padding: "8px", fontSize: "11px", display: "flex", gap: "6px", color: "var(--color-danger)", borderColor: "var(--color-danger)" }}
                  >
                    <AlertOctagon size={12} />
                    <span>Trigger Goal Creation Escalations</span>
                  </button>
                  <button 
                    onClick={() => {
                      // Travell to August 11 to trigger Q1 checkin overdue escalations
                      handleDateChange("2026-08-11");
                      showToast("warning", "Escalation engine evaluated: Aug 10 Q1 Check-in deadline breached!");
                    }}
                    className="btn btn-secondary" 
                    style={{ padding: "8px", fontSize: "11px", display: "flex", gap: "6px", color: "var(--color-danger)", borderColor: "var(--color-danger)" }}
                  >
                    <AlertOctagon size={12} />
                    <span>Trigger Q1 Check-in Escalations</span>
                  </button>
                </div>
              </div>

              {/* Quick instructions */}
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", borderTop: "1px dashed var(--border-color)", paddingTop: "12px" }}>
                💡 <strong>Tip</strong>: Click the <strong>Notification Hub</strong> menu tab to inspect the simulated Teams cards and Outlook email logs generated during your testing.
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Global Banner Toast drawers */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13.5px", fontWeight: "600" }}>{t.message}</span>
            <button 
              onClick={() => removeToast(t.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
