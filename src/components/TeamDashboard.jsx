import React, { useState, useEffect } from "react";
import { Users, AlertCircle, CheckCircle2, Lock, Edit3, MessageSquare, AlertTriangle } from "lucide-react";

export default function TeamDashboard({ 
  currentUser, 
  users, 
  goals, 
  sheets, 
  onInlineGoalEdit, 
  onApproveSheet, 
  onShowToast 
}) {
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [managerGoals, setManagerGoals] = useState([]);
  const [managerComment, setManagerComment] = useState("");
  const [showReworkBox, setShowReworkBox] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);

  // Draft state variables for inline editing
  const [tempWeightage, setTempWeightage] = useState("");
  const [tempTarget, setTempTarget] = useState("");

  // Get direct reporting employees
  const subordinates = users.filter(u => u.reportingTo === currentUser.id);

  useEffect(() => {
    if (subordinates.length > 0 && !selectedEmpId) {
      setSelectedEmpId(subordinates[0].id);
    }
  }, [subordinates, selectedEmpId]);

  useEffect(() => {
    if (selectedEmpId) {
      const empGoals = goals.filter(g => g.userId === selectedEmpId);
      setManagerGoals(empGoals.map(g => ({ ...g })));
      setManagerComment("");
      setShowReworkBox(false);
      setEditingGoalId(null);
    }
  }, [selectedEmpId, goals]);

  const selectedEmp = users.find(u => u.id === selectedEmpId);
  const selectedSheet = sheets.find(s => s.userId === selectedEmpId);

  // Calculate live total weightage of currently loaded goals
  const totalWeightage = managerGoals.reduce((sum, g) => sum + parseFloat(g.weightage || 0), 0);

  const startInlineEdit = (goal) => {
    setEditingGoalId(goal.id);
    setTempWeightage(goal.weightage);
    setTempTarget(goal.target);
  };

  const cancelInlineEdit = () => {
    setEditingGoalId(null);
  };

  const saveInlineEdit = (goalId) => {
    const weightNum = parseFloat(tempWeightage);
    if (isNaN(weightNum) || weightNum < 10) {
      onShowToast("error", "Goal weightage must be a number of at least 10%.");
      return;
    }

    try {
      // Execute edit mutation in main database
      onInlineGoalEdit(selectedEmpId, goalId, {
        target: tempTarget,
        weightage: weightNum
      });
      
      // Update local state copy
      setManagerGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return { ...g, target: tempTarget, weightage: weightNum };
        }
        return g;
      }));

      setEditingGoalId(null);
      onShowToast("success", "Employee goal updated inline!");
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  const handleApprove = () => {
    if (totalWeightage !== 100) {
      onShowToast("error", `Total goal weightage must equal exactly 100%. Currently it is ${totalWeightage}%. Modify inline before approving.`);
      return;
    }

    try {
      onApproveSheet(selectedEmpId, "APPROVED", managerComment, currentUser);
      onShowToast("success", `Approved ${selectedEmp.name}'s goal sheet and locked it successfully!`);
      setManagerComment("");
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  const handleRework = () => {
    if (!managerComment.trim()) {
      onShowToast("warning", "Please provide return rework feedback comments to clarify requested edits.");
      return;
    }

    try {
      onApproveSheet(selectedEmpId, "REWORK", managerComment, currentUser);
      onShowToast("info", `Goal sheet returned to ${selectedEmp.name} for reworking.`);
      setShowReworkBox(false);
      setManagerComment("");
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
      
      {/* Subordinates Side Menu */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px", height: "fit-content" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={18} className="text-brand" style={{ color: "var(--color-brand)" }} />
          <span>Direct Reports</span>
        </h3>
        
        {subordinates.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>
            No direct reports found under your hierarchy reporting lines.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {subordinates.map(sub => {
              const subSheet = sheets.find(s => s.userId === sub.id);
              const status = subSheet ? subSheet.status : "DRAFT";
              const isActive = selectedEmpId === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedEmpId(sub.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: isActive ? "1px solid var(--color-brand)" : "1px solid var(--border-color)",
                    backgroundColor: isActive ? "var(--color-brand-glow)" : "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                    <span style={{ fontSize: "20px" }}>{sub.avatar}</span>
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
                      <span style={{ fontSize: "13.5px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub.name}</span>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{sub.title}</span>
                    </div>
                  </div>
                  <span 
                    className={`badge badge-${status.toLowerCase()}`}
                    style={{ fontSize: "9px", marginTop: "8px", alignSelf: "flex-end" }}
                  >
                    {status.replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Employee Goals Review Pane */}
      {selectedEmp && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Header Card info */}
          <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>
                Goal Sheet Review: {selectedEmp.name}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {selectedEmp.title} | Department: {selectedEmp.department}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", display: "block" }}>
                Sheet Status
              </span>
              <span className={`badge ${selectedSheet ? `badge-${selectedSheet.status.toLowerCase()}` : 'badge-draft'}`} style={{ marginTop: "4px" }}>
                {selectedSheet ? selectedSheet.status.replace('_', ' ') : 'DRAFT'}
              </span>
            </div>
          </div>

          {/* Weightage recalculator banner */}
          {selectedSheet && selectedSheet.status === "PENDING_APPROVAL" && (
            <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderLeft: `6px solid ${totalWeightage === 100 ? 'var(--color-success)' : 'var(--color-danger)'}`, backgroundColor: "var(--bg-tertiary)" }}>
              <div>
                <span style={{ fontSize: "13.5px", fontWeight: "700" }}>Live Inline Calculation Checker</span>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  If you edit goals inline, the new sum must equal exactly 100% to finalize approval.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", color: totalWeightage === 100 ? "var(--color-success)" : "var(--color-danger)" }}>
                  {totalWeightage}%
                </span>
                {totalWeightage !== 100 && (
                  <span style={{ fontSize: "12px", color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <AlertTriangle size={14} />
                    <span>Adjust weightage to approve!</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Goals Detail Review Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {managerGoals.length === 0 ? (
              <div className="glass-panel" style={{ padding: "40px", textContent: "center", color: "var(--text-muted)" }}>
                This employee has not added any goals to their sheet yet.
              </div>
            ) : (
              managerGoals.map((goal) => {
                const isEditing = editingGoalId === goal.id;
                
                return (
                  <div key={goal.id} className="glass-panel" style={{ position: "relative" }}>
                    {goal.isShared && (
                      <div style={{ position: "absolute", top: "12px", right: "20px" }}>
                        <span className="badge badge-pending" style={{ fontSize: "9px" }}>Cascaded Departmental KPI</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--color-brand)", textTransform: "uppercase" }}>
                          {goal.thrustArea}
                        </span>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", marginTop: "4px" }}>{goal.title}</h3>
                        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px" }}>{goal.description}</p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "16px", backgroundColor: "var(--bg-tertiary)", padding: "16px", borderRadius: "var(--radius-sm)" }}>
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>UoM</span>
                        <span style={{ display: "block", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" }}>{goal.uom}</span>
                      </div>

                      {/* Target Field Display or Edit */}
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Target</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempTarget}
                            onChange={(e) => setTempTarget(e.target.value)}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "13px", marginTop: "2px" }}
                          />
                        ) : (
                          <span style={{ display: "block", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" }}>{goal.target}</span>
                        )}
                      </div>

                      {/* Weightage Field Display or Edit */}
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Weightage</span>
                        {isEditing ? (
                          <input
                            type="number"
                            min={10}
                            max={100}
                            value={tempWeightage}
                            onChange={(e) => setTempWeightage(e.target.value)}
                            className="form-control"
                            style={{ padding: "4px 8px", fontSize: "13px", marginTop: "2px" }}
                          />
                        ) : (
                          <span style={{ display: "block", fontSize: "13.5px", fontWeight: "600", marginTop: "2px" }}>{goal.weightage}%</span>
                        )}
                      </div>
                    </div>

                    {/* Inline editing control keys */}
                    {selectedSheet && selectedSheet.status === "PENDING_APPROVAL" && (
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                        {isEditing ? (
                          <>
                            <button onClick={cancelInlineEdit} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>
                              Cancel
                            </button>
                            <button onClick={() => saveInlineEdit(goal.id)} className="btn btn-success" style={{ padding: "4px 10px", fontSize: "12px" }}>
                              Save Inline
                            </button>
                          </>
                        ) : (
                          <button onClick={() => startInlineEdit(goal)} className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "var(--color-brand)" }}>
                            <Edit3 size={12} />
                            <span>Modify Goal Inline</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Decision actions panels for managers */}
          {selectedSheet && selectedSheet.status === "PENDING_APPROVAL" && (
            <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <MessageSquare size={16} />
                <span>Structured Feedback & Comments</span>
              </h3>
              
              <textarea
                rows={3}
                placeholder="Enter feedback comments for the employee regarding targets, alignments, or approval discussion..."
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                className="form-textarea"
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                {!showReworkBox ? (
                  <>
                    <button 
                      onClick={() => setShowReworkBox(true)} 
                      className="btn btn-secondary" 
                      style={{ color: "var(--color-danger)", borderColor: "var(--color-danger)" }}
                    >
                      Return for Rework
                    </button>
                    <button 
                      onClick={handleApprove} 
                      disabled={totalWeightage !== 100}
                      className="btn btn-primary"
                    >
                      Approve & Lock Goal Sheet
                    </button>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", alignItems: "flex-end" }}>
                    <p style={{ fontSize: "12.5px", color: "var(--color-danger)", alignSelf: "flex-start" }}>
                      ⚠️ Returning this sheet will allow the employee to edit the fields again. Your feedback comment is required.
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => setShowReworkBox(false)} className="btn btn-secondary">
                        Cancel
                      </button>
                      <button onClick={handleRework} className="btn btn-danger">
                        Confirm Return for Rework
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedSheet && selectedSheet.status === "APPROVED" && (
            <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "6px solid var(--color-success)", backgroundColor: "var(--color-success-bg)", padding: "16px 20px" }}>
              <Lock size={20} style={{ color: "var(--color-success)" }} />
              <div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--color-success)" }}>Goals Secured & Active</span>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  This sheet has been locked. Achievements can be logged quarterly during open cycle windows.
                </p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
