import React, { useState, useEffect } from "react";
import { CheckSquare, MessageSquare, ShieldAlert, Award, Clock, ArrowRight, Lock, Eye } from "lucide-react";
import { calculateProgressScore } from "../data/mockStore";

const QUARTERS = [
  { id: "Q1", label: "Q1 Progress Review", fieldSuffix: "Q1", windowMonthName: "July" },
  { id: "Q2", label: "Q2 Progress Review", fieldSuffix: "Q2", windowMonthName: "October" },
  { id: "Q3", label: "Q3 Progress Review", fieldSuffix: "Q3", windowMonthName: "January" },
  { id: "Q4", label: "Q4 / Annual Final Review", fieldSuffix: "Q4", windowMonthName: "March/April" }
];

export default function CheckinManager({ 
  currentUser, 
  users, 
  goals, 
  sheets, 
  activeCycle, 
  onUpdateAchievement, 
  onSaveComment, 
  onShowToast 
}) {
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [empGoals, setEmpGoals] = useState([]);
  const [managerComment, setManagerComment] = useState("");
  const [bypassDateLock, setBypassDateLock] = useState(true); // Default true to allow easy test of any quarter!

  // Input states for goals achievements
  const [actualInputs, setActualInputs] = useState({});
  const [statusInputs, setStatusInputs] = useState({});

  const subordinates = users.filter(u => u.reportingTo === currentUser.id);

  // Sync active quarter from the simulator
  useEffect(() => {
    if (activeCycle && activeCycle.quarter !== "Q0") {
      setSelectedQuarter(activeCycle.quarter);
    }
  }, [activeCycle]);

  // Set default employee search
  useEffect(() => {
    if (currentUser.role !== "Employee") {
      if (subordinates.length > 0 && !selectedEmpId) {
        setSelectedEmpId(subordinates[0].id);
      }
    } else {
      setSelectedEmpId(currentUser.id);
    }
  }, [currentUser, subordinates, selectedEmpId]);

  useEffect(() => {
    if (selectedEmpId) {
      const filteredGoals = goals.filter(g => g.userId === selectedEmpId);
      setEmpGoals(filteredGoals);

      // Load existing values into form inputs
      const actuals = {};
      const statuses = {};
      filteredGoals.forEach(g => {
        actuals[g.id] = g[`actual${selectedQuarter}`] || "";
        statuses[g.id] = g[`status${selectedQuarter}`] || "Not Started";
      });
      setActualInputs(actuals);
      setStatusInputs(statuses);

      // Load manager check-in comment
      const sheet = sheets.find(s => s.userId === selectedEmpId);
      const qComment = sheet?.checkinComments?.[selectedQuarter]?.comment || "";
      setManagerComment(qComment);
    }
  }, [selectedEmpId, selectedQuarter, goals, sheets]);

  // Date lock check
  // Employee can only write if the simulated quarter matches OR developer bypass is active
  const isWindowClosedForWriting = !bypassDateLock && (activeCycle.quarter !== selectedQuarter);
  
  const selectedEmp = users.find(u => u.id === selectedEmpId);
  const selectedSheet = sheets.find(s => s.userId === selectedEmpId);
  const isSheetApproved = selectedSheet && selectedSheet.status === "APPROVED";

  const handleActualChange = (goalId, val) => {
    setActualInputs(prev => ({ ...prev, [goalId]: val }));
  };

  const handleStatusChange = (goalId, val) => {
    setStatusInputs(prev => ({ ...prev, [goalId]: val }));
  };

  const handleSaveAchievements = () => {
    if (!isSheetApproved) {
      onShowToast("error", "Achievements cannot be logged. Goal sheet must be APPROVED and locked by manager first.");
      return;
    }

    try {
      empGoals.forEach(g => {
        onUpdateAchievement(
          g.id, 
          selectedQuarter, 
          actualInputs[g.id], 
          statusInputs[g.id], 
          currentUser
        );
      });
      onShowToast("success", `${selectedQuarter} achievements updated successfully!`);
    } catch (e) {
      onShowToast("error", e.message);
    }
  };

  const handleSaveFeedback = () => {
    try {
      onSaveComment(selectedEmpId, selectedQuarter, managerComment, currentUser);
      onShowToast("success", `${selectedQuarter} manager comment updated and logged!`);
    } catch (e) {
      onShowToast("error", e.message);
    }
  };

  const renderFormulaExplanation = (uom) => {
    switch (uom) {
      case "Numeric":
      case "%":
        return "Min (Higher is better) = Actual ÷ Target";
      case "Timeline":
        return "Completion Date vs Deadline (Late penalised)";
      case "Zero-based":
        return "Zero = Success. 0 → 100%, else 0%";
      default:
        return "";
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Quarter Tab Selector */}
      <div className="glass-panel" style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {QUARTERS.map(q => {
            const isSimulatedActive = activeCycle.quarter === q.id;
            const isTabSelected = selectedQuarter === q.id;

            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuarter(q.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: isTabSelected ? "1px solid var(--color-brand)" : "1px solid var(--border-color)",
                  backgroundColor: isTabSelected ? "var(--color-brand-glow)" : "var(--bg-tertiary)",
                  color: isTabSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span>{q.label}</span>
                {isSimulatedActive && (
                  <span style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: "var(--color-brand)" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Developer Sandbox Bypass Date check */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={bypassDateLock}
              onChange={(e) => setBypassDateLock(e.target.checked)}
              style={{ accentColor: "var(--color-brand)" }}
            />
            <span>Bypass Date Lock for testing</span>
          </label>
        </div>
      </div>

      {/* Date Window Guard Information Banner */}
      {!bypassDateLock && isWindowClosedForWriting && (
        <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "6px solid var(--color-warning)", backgroundColor: "var(--color-warning-bg)", padding: "16px 20px" }}>
          <ShieldAlert size={20} style={{ color: "var(--color-warning)" }} />
          <div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-warning)" }}>Closed Window / Review Mode</span>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              The {selectedQuarter} check-in window opens in <strong>{QUARTERS.find(q => q.id === selectedQuarter)?.windowMonthName}</strong>. 
              Currently viewing in read-only review mode. Use the <em>Date Simulator</em> at the top to change dates, or check the <em>Bypass Date Lock</em> toggle.
            </p>
          </div>
        </div>
      )}

      {/* Role view controller: Manager select Employee, Employee view static */}
      {currentUser.role !== "Employee" && (
        <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px" }}>
          <label className="form-label" style={{ margin: 0, whiteSpace: "nowrap" }}>Select Employee to Review:</label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="form-select"
            style={{ maxWidth: "300px", padding: "8px 12px" }}
          >
            {subordinates.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name} ({sub.title})</option>
            ))}
          </select>
        </div>
      )}

      {/* Main Grid: Goals Actual entry Form vs Manager structured comment feedback */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        
        {/* Goal actuals list */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} className="text-brand" style={{ color: "var(--color-brand)" }} />
            <span>Achievement Logs ({selectedQuarter})</span>
          </h3>

          {!isSheetApproved && (
            <div style={{ padding: "20px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-danger-bg)", border: "1px solid rgba(239, 68, 68, 0.15)", fontSize: "13.5px" }}>
              ⚠️ Employee goal sheet is currently in <strong>{selectedSheet ? selectedSheet.status : 'DRAFT'}</strong> state. 
              Actual progress logging is only enabled once the sheet is fully approved and locked by the manager.
            </div>
          )}

          {isSheetApproved && empGoals.length === 0 && (
            <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "13.5px" }}>
              No goals set for this sheet.
            </p>
          )}

          {isSheetApproved && empGoals.map(goal => {
            const actualVal = actualInputs[goal.id] || "";
            const statusVal = statusInputs[goal.id] || "Not Started";
            const calculatedScore = calculateProgressScore(goal.uom, goal.target, actualVal);
            
            // Format display of progress score
            const displayScore = isNaN(calculatedScore) ? "0%" : `${Math.round(calculatedScore * 100)}%`;

            const isGoalSharedCascade = goal.isShared && goal.sharedFromGoalId;
            const isEmployeeWritingEnabled = currentUser.role === "Employee" && !isWindowClosedForWriting;

            return (
              <div 
                key={goal.id} 
                style={{ 
                  padding: "20px", 
                  backgroundColor: "var(--bg-tertiary)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                {/* Goal Info */}
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--color-brand)", textTransform: "uppercase" }}>{goal.thrustArea}</span>
                    <h4 style={{ fontSize: "15px", fontWeight: "700", marginTop: "2px" }}>{goal.title}</h4>
                    <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>{goal.description}</p>
                  </div>
                  
                  {isGoalSharedCascade && (
                    <span className="badge badge-pending" style={{ fontSize: "8.5px", height: "fit-content" }}>
                      Cascaded KPI achievement syncs from primary owner
                    </span>
                  )}
                </div>

                {/* Planned targets */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", borderTop: "1px dashed var(--border-color)", paddingTop: "14px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Target Metrics</span>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {goal.target} {goal.uom === "%" ? "%" : ""}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Weightage</span>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {goal.weightage}%
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>Formula Mode</span>
                    </span>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--color-brand)", fontStyle: "italic", marginTop: "2px" }}>
                      {renderFormulaExplanation(goal.uom)}
                    </span>
                  </div>
                </div>

                {/* Form Input fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: "16px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px" }}>Actual Achievement</label>
                    <input
                      type={goal.uom === "Timeline" ? "date" : "text"}
                      disabled={!isEmployeeWritingEnabled || isGoalSharedCascade}
                      placeholder={goal.uom === "Timeline" ? "Select completion date" : "Enter achieved value"}
                      value={actualVal}
                      onChange={(e) => handleActualChange(goal.id, e.target.value)}
                      className="form-control"
                      style={{ padding: "8px 12px" }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "12px" }}>Status</label>
                    <select
                      disabled={!isEmployeeWritingEnabled || isGoalSharedCascade}
                      value={statusVal}
                      onChange={(e) => handleStatusChange(goal.id, e.target.value)}
                      className="form-select"
                      style={{ padding: "8px 12px" }}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="On Track">On Track</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Calculated metrics visual widget */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "42px", backgroundColor: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                    <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase" }}>Progress Score</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: parseFloat(displayScore) >= 100 ? "var(--color-success)" : "var(--color-brand)" }}>
                      {displayScore}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}

          {isSheetApproved && currentUser.role === "Employee" && !isWindowClosedForWriting && empGoals.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button onClick={handleSaveAchievements} className="btn btn-primary">
                Save Q1-Q4 Actual Achievements
              </button>
            </div>
          )}
        </div>

        {/* Manager feedback comments section */}
        {isSheetApproved && (
          <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageSquare size={18} className="text-brand" style={{ color: "var(--color-brand)" }} />
              <span>Manager Structured Feedback Discussion ({selectedQuarter})</span>
            </h3>

            {selectedSheet && selectedSheet.checkinComments?.[selectedQuarter] ? (
              <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-tertiary)", borderLeft: "4px solid var(--color-brand)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                  <span>Logged by L1 Manager: <strong>{selectedSheet.checkinComments[selectedQuarter].managerName}</strong></span>
                  <span>{new Date(selectedSheet.checkinComments[selectedQuarter].updatedAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--text-primary)" }}>
                  "{selectedSheet.checkinComments[selectedQuarter].comment}"
                </p>
              </div>
            ) : (
              <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "13.5px" }}>
                No structured feedback logged by manager for {selectedQuarter} yet.
              </p>
            )}

            {/* Manager writing zone */}
            {currentUser.role !== "Employee" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Review Comment (Manager L1 only)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide performance feedback regarding milestone achievements, hurdles faced, or developmental priorities for the employee..."
                    value={managerComment}
                    onChange={(e) => setManagerComment(e.target.value)}
                    className="form-textarea"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={handleSaveFeedback} className="btn btn-secondary" style={{ color: "var(--color-brand)", borderColor: "var(--color-brand)" }}>
                    Submit Check-in Discussion Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
