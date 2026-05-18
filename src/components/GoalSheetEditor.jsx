import React, { useState, useEffect } from "react";
import { Plus, Trash2, ShieldAlert, CheckCircle2, Lock, HelpCircle } from "lucide-react";

const THRUST_AREAS = [
  "Innovation & Technology",
  "Energy Efficiency",
  "Operational Excellence",
  "Customer Centricity",
  "Safety & Compliance"
];

const UOM_TYPES = [
  { value: "Numeric", label: "Numeric (e.g., Sales, Revenue)" },
  { value: "%", label: "Percentage (e.g., Reduction, Yield)" },
  { value: "Timeline", label: "Timeline (Date Completion)" },
  { value: "Zero-based", label: "Zero-based (0 = Perfect Success)" }
];

export default function GoalSheetEditor({ 
  currentUser, 
  goals, 
  sheet, 
  onSave, 
  onSubmit, 
  onShowToast 
}) {
  const [editorGoals, setEditorGoals] = useState([]);
  
  useEffect(() => {
    // Filter out shared goals, as employee can only adjust weightages of shared goals
    // Wait, let's actually load ALL employee goals (including shared) so they can view and adjust weightages!
    // But the title, description, and target of shared goals must be READ-ONLY!
    const userGoals = goals.filter(g => g.userId === currentUser.id);
    setEditorGoals(userGoals.map(g => ({ ...g })));
  }, [goals, currentUser, sheet]);

  const isLocked = sheet && (sheet.status === "PENDING_APPROVAL" || sheet.status === "APPROVED");

  // Calculate live total weightage
  const totalWeightage = editorGoals.reduce((sum, g) => sum + parseFloat(g.weightage || 0), 0);

  const handleAddGoal = () => {
    if (editorGoals.length >= 8) {
      onShowToast("error", "Maximum limit reached. You can only define up to 8 goals.");
      return;
    }

    const newGoal = {
      id: "", // Blank indicates new goal
      thrustArea: THRUST_AREAS[0],
      title: "",
      description: "",
      uom: "Numeric",
      target: "",
      weightage: 10, // Default to minimum required weightage
      actualQ1: "", statusQ1: "Not Started",
      actualQ2: "", statusQ2: "Not Started",
      actualQ3: "", statusQ3: "Not Started",
      actualQ4: "", statusQ4: "Not Started",
      isShared: false
    };

    setEditorGoals([...editorGoals, newGoal]);
  };

  const handleRemoveGoal = (index) => {
    const updated = [...editorGoals];
    const removed = updated.splice(index, 1)[0];
    setEditorGoals(updated);
    onShowToast("info", `Removed goal Draft: "${removed.title || 'Untitled'}"`);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...editorGoals];
    
    // Shared goal guards: title/target are read-only
    if (updated[index].isShared && (field === "title" || field === "description" || field === "target" || field === "thrustArea" || field === "uom")) {
      onShowToast("warning", "This is a cascaded Departmental KPI. You can only adjust the weightage.");
      return;
    }

    if (field === "weightage") {
      updated[index][field] = value === "" ? "" : parseFloat(value);
    } else {
      updated[index][field] = value;
    }
    setEditorGoals(updated);
  };

  const handleSaveDraft = () => {
    try {
      onSave(currentUser.id, editorGoals);
      onShowToast("success", "Goal sheet draft saved successfully!");
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  const handleSubmitSheet = () => {
    try {
      onSubmit(currentUser.id, editorGoals);
      onShowToast("success", "Goal sheet submitted to manager for approval!");
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* State Callout Board */}
      <div className="glass-panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 24px", borderColor: isLocked ? "var(--color-success)" : "var(--border-color)" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Status: </span>
            <span className={`badge ${sheet ? `badge-${sheet.status.toLowerCase()}` : 'badge-draft'}`}>
              {sheet ? sheet.status.replace('_', ' ') : 'DRAFT'}
            </span>
          </h2>
          {sheet && sheet.status === "APPROVED" && (
            <p style={{ fontSize: "13px", color: "var(--color-success)", marginTop: "4px" }}>
              ✓ Locked. Approved by L1 Manager. No further edits are permitted without HR intervention.
            </p>
          )}
          {sheet && sheet.status === "PENDING_APPROVAL" && (
            <p style={{ fontSize: "13px", color: "var(--color-warning)", marginTop: "4px" }}>
              ⏳ Goal sheet is locked. Pending manager review and inline adjustments.
            </p>
          )}
          {sheet && sheet.status === "REWORK" && (
            <div style={{ marginTop: "10px", padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-danger-bg)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-danger)" }}>Manager Return Feedback:</span>
              <p style={{ fontSize: "13px", fontStyle: "italic", marginTop: "2px" }}>"{sheet.comment}"</p>
            </div>
          )}
        </div>

        {isLocked && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "13px", backgroundColor: "var(--bg-tertiary)", padding: "10px 16px", borderRadius: "var(--radius-sm)" }}>
            <Lock size={16} className="text-brand" style={{ color: "var(--color-brand)" }} />
            <span>Form Locked (Read-Only)</span>
          </div>
        )}
      </div>

      {/* Goal Weightage Balance Sheet Indicator */}
      {!isLocked && (
        <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", borderLeft: `6px solid ${totalWeightage === 100 ? 'var(--color-success)' : 'var(--color-warning)'}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: "700" }}>Validation Rule Checker</h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                Total Weightage must equal exactly <strong>100%</strong> | Min individual weightage: <strong>10%</strong>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "20px", fontWeight: "800", color: totalWeightage === 100 ? "var(--color-success)" : "var(--color-warning)" }}>
                {totalWeightage}%
              </span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}> / 100%</span>
            </div>
          </div>

          {/* Progress bar scale */}
          <div className="progress-container" style={{ height: "10px" }}>
            <div 
              className={`progress-fill ${totalWeightage === 100 ? 'progress-success' : 'progress-brand'}`} 
              style={{ width: `${Math.min(100, totalWeightage)}%` }}
            />
          </div>

          {/* Validation Warnings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {totalWeightage !== 100 && (
              <span style={{ fontSize: "12px", color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldAlert size={14} />
                <span>Total weightage is {totalWeightage}%. Must be exactly 100% to submit.</span>
              </span>
            )}
            {editorGoals.some(g => parseFloat(g.weightage || 0) < 10) && (
              <span style={{ fontSize: "12px", color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldAlert size={14} />
                <span>Warning: One or more goals have less than 10% weightage.</span>
              </span>
            )}
            {editorGoals.length === 0 && (
              <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                <HelpCircle size={14} />
                <span>Click "Add Goal Objective" to start drafting your goals.</span>
              </span>
            )}
            {totalWeightage === 100 && !editorGoals.some(g => parseFloat(g.weightage || 0) < 10) && (
              <span style={{ fontSize: "12px", color: "var(--color-success)", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={14} />
                <span>All validations passed! Your sheet is ready for submission.</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Goal Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {editorGoals.map((goal, index) => (
          <div 
            key={index} 
            className="glass-panel" 
            style={{ 
              padding: "24px", 
              borderLeft: goal.isShared ? "6px solid var(--color-brand)" : "1px solid var(--border-color)",
              position: "relative" 
            }}
          >
            {/* Shared Indicator tag */}
            {goal.isShared && (
              <div style={{ position: "absolute", top: "12px", right: "20px", display: "flex", gap: "6px", alignItems: "center" }}>
                <span className="badge badge-pending" style={{ fontSize: "9px" }}>Cascaded KPI</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", margin: "10px 0" }}>
              <div className="form-group">
                <label className="form-label">Thrust Area</label>
                <select
                  disabled={isLocked || goal.isShared}
                  value={goal.thrustArea}
                  onChange={(e) => handleFieldChange(index, "thrustArea", e.target.value)}
                  className="form-select"
                >
                  {THRUST_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Unit of Measurement (UoM)</label>
                <select
                  disabled={isLocked || goal.isShared}
                  value={goal.uom}
                  onChange={(e) => handleFieldChange(index, "uom", e.target.value)}
                  className="form-select"
                >
                  {UOM_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Goal Title</label>
              <input
                type="text"
                disabled={isLocked || goal.isShared}
                placeholder="Describe what you want to achieve"
                value={goal.title}
                onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Goal Description</label>
              <textarea
                rows={3}
                disabled={isLocked || goal.isShared}
                placeholder="Provide details on action plans and strategic deliverables..."
                value={goal.description}
                onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                className="form-textarea"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "12px" }}>
              <div className="form-group">
                <label className="form-label">
                  Target {goal.uom === "Timeline" ? "(Deadline)" : ""}
                </label>
                <input
                  type={goal.uom === "Timeline" ? "date" : "text"}
                  disabled={isLocked || goal.isShared}
                  placeholder={goal.uom === "Timeline" ? "Select deadline" : "Enter metric target value"}
                  value={goal.target}
                  onChange={(e) => handleFieldChange(index, "target", e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Goal Weightage (%)</label>
                <input
                  type="number"
                  disabled={isLocked}
                  min={10}
                  max={100}
                  placeholder="Minimum 10%"
                  value={goal.weightage}
                  onChange={(e) => handleFieldChange(index, "weightage", e.target.value)}
                  className="form-control"
                  style={{ borderColor: parseFloat(goal.weightage || 0) < 10 ? "var(--color-danger)" : "var(--border-color)" }}
                />
                {parseFloat(goal.weightage || 0) < 10 && (
                  <span style={{ fontSize: "11px", color: "var(--color-danger)", marginTop: "4px", display: "block" }}>
                    ⚠️ Must be at least 10%
                  </span>
                )}
              </div>
            </div>

            {/* Remove Button for drafts */}
            {!isLocked && !goal.isShared && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                <button
                  onClick={() => handleRemoveGoal(index)}
                  className="btn btn-secondary"
                  style={{ color: "var(--color-danger)", borderColor: "transparent", padding: "6px 12px" }}
                >
                  <Trash2 size={14} />
                  <span>Delete Goal</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Editor Controls */}
      {!isLocked && (
        <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", padding: "20px 24px" }}>
          <button onClick={handleAddGoal} className="btn btn-secondary">
            <Plus size={16} />
            <span>Add Goal Objective</span>
          </button>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleSaveDraft} className="btn btn-secondary">
              Save Draft
            </button>
            <button 
              onClick={handleSubmitSheet} 
              disabled={totalWeightage !== 100 || editorGoals.some(g => parseFloat(g.weightage || 0) < 10)}
              className="btn btn-primary"
            >
              Submit Goal Sheet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
