import React, { useState } from "react";
import { Share2, Users, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SharedGoalManager({ 
  currentUser, 
  users, 
  goals, 
  onCascadeKPI, 
  onShowToast 
}) {
  const [selectedKpiId, setSelectedKpiId] = useState("");
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);

  // Fetch departmental KPIs owned by this manager or Admin
  // Wait, let's allow cascade of goals where isCascadeOrigin is true
  const departmentalKpis = goals.filter(g => g.userId === currentUser.id && g.isCascadeOrigin);

  const eligibleEmployees = users.filter(u => u.id !== currentUser.id && u.role === "Employee");

  const handleToggleEmployee = (empId) => {
    setSelectedEmpIds(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const handleCascadeSubmit = () => {
    if (!selectedKpiId) {
      onShowToast("warning", "Please select a departmental KPI goal to cascade.");
      return;
    }
    if (selectedEmpIds.length === 0) {
      onShowToast("warning", "Please select at least one employee recipient.");
      return;
    }

    try {
      onCascadeKPI(selectedKpiId, selectedEmpIds, currentUser);
      onShowToast("success", "Departmental KPI cascaded and pushed to employee goal sheets!");
      setSelectedEmpIds([]);
    } catch (e) {
      onShowToast("error", e.message);
    }
  };

  const selectedKpi = goals.find(g => g.id === selectedKpiId);

  return (
    <div className="glass-panel animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <Share2 size={20} className="text-brand" style={{ color: "var(--color-brand)" }} />
          <span>Departmental KPI Cascading Center</span>
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Pushes high-priority corporate and engineering metrics to direct report sheets. Recipients can only modify weightages.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Step 1: Select KPI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700" }}>1. Select Departmental KPI Objective</h3>

          {departmentalKpis.length === 0 ? (
            <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)", fontSize: "13px" }}>
              No departmental KPIs found owned by your account. As Rajesh (Manager L1), you have pre-seeded Engineering turnaround time KPI available to push.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {departmentalKpis.map(kpi => {
                const isSelected = selectedKpiId === kpi.id;

                return (
                  <button
                    key={kpi.id}
                    onClick={() => setSelectedKpiId(kpi.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px",
                      borderRadius: "var(--radius-sm)",
                      border: isSelected ? "1px solid var(--color-brand)" : "1px solid var(--border-color)",
                      backgroundColor: isSelected ? "var(--color-brand-glow)" : "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "var(--color-brand)", fontWeight: "700", textTransform: "uppercase" }}>
                      {kpi.thrustArea}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "700", marginTop: "4px" }}>{kpi.title}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                      Target Metric: <strong>{kpi.target} {kpi.uom}</strong>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Preview details */}
          {selectedKpi && (
            <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border-color)", fontSize: "13px", color: "var(--text-secondary)" }}>
              <span style={{ fontWeight: "700", display: "block", marginBottom: "4px" }}>KPI Description:</span>
              <p>"{selectedKpi.description}"</p>
            </div>
          )}
        </div>

        {/* Step 2: Select Employees and Submit */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderLeft: "1px solid var(--border-color)", paddingLeft: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700" }}>2. Select Recipients</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {eligibleEmployees.map(emp => {
              const isChecked = selectedEmpIds.includes(emp.id);

              return (
                <label
                  key={emp.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                    fontSize: "13.5px"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleEmployee(emp.id)}
                    style={{ accentColor: "var(--color-brand)" }}
                  />
                  <span style={{ fontSize: "20px" }}>{emp.avatar}</span>
                  <div>
                    <span style={{ fontWeight: "600", display: "block" }}>{emp.name}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{emp.title}</span>
                  </div>
                </label>
              );
            })}
          </div>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleCascadeSubmit}
              disabled={!selectedKpiId || selectedEmpIds.length === 0}
              className="btn btn-primary"
            >
              <Share2 size={16} />
              <span>Cascade KPI Goal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
