import React from "react";
import { ShieldAlert, Unlock, History, AlertTriangle, Eye, Clock, ShieldCheck } from "lucide-react";

export default function EscalationView({ 
  currentUser, 
  users, 
  sheets, 
  audits, 
  escalations, 
  onUnlockSheet, 
  onShowToast 
}) {

  const handleUnlockClick = (empId) => {
    const emp = users.find(u => u.id === empId);
    if (!emp) return;

    if (window.confirm(`Are you sure you want to UNLOCK the goal sheet for ${emp.name}? This will return it to DRAFT state and allow changes.`)) {
      try {
        onUnlockSheet(empId, currentUser);
        onShowToast("success", `Unlocked goal sheet for ${emp.name}. State reset to DRAFT.`);
      } catch (e) {
        onShowToast("error", e.message);
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Governance Banner Header */}
      <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "5px solid var(--color-danger)" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={20} style={{ color: "var(--color-danger)" }} />
            <span>Audit & Governance Portal</span>
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Monitor organizational compliance violations, audit administrative actions, and manage goal sheet locks.
          </p>
        </div>
      </div>

      {/* Rule-Based Escalation Monitor Logs */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} />
          <span>Rule-Based Escalation Logs (Real-time triggers)</span>
        </h3>
        
        {escalations.length === 0 ? (
          <div style={{ padding: "20px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-success-bg)", border: "1px solid rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px" }}>
            <ShieldCheck size={18} style={{ color: "var(--color-success)" }} />
            <span>100% compliance. No active escalation alerts triggered for the current simulated system date.</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {escalations.map(esc => (
              <div 
                key={esc.id} 
                style={{ 
                  padding: "16px", 
                  backgroundColor: "var(--bg-tertiary)", 
                  border: "1px solid var(--border-color)", 
                  borderLeft: `4px solid ${esc.severity === 'HIGH' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: esc.severity === 'HIGH' ? "var(--color-danger)" : "var(--color-warning)", textTransform: "uppercase" }}>
                    Severity: {esc.severity}
                  </span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", marginTop: "2px" }}>
                    {esc.ruleTriggered}
                  </h4>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    <strong>Employee</strong>: {esc.employeeName} | <strong>Direct Manager</strong>: {esc.managerName}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", backgroundColor: "rgba(255, 90, 31, 0.08)", border: "1px dashed var(--color-brand)", color: "var(--color-brand)", padding: "2px 8px", borderRadius: "4px" }}>
                    {esc.status}
                  </span>
                  <span style={{ display: "block", fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {new Date(esc.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal Unlock Administrator Panel */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <Unlock size={18} className="text-brand" style={{ color: "var(--color-brand)" }} />
          <span>Goal Exception Handling (Unlock locked sheets)</span>
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Administrative exception override: Unlocking returns an approved or pending sheet back to draft status, resetting the locked lockups and allowing modification.
        </p>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Reporting To</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === "Employee").map(emp => {
                const sheet = sheets.find(s => s.userId === emp.id);
                const status = sheet ? sheet.status : "DRAFT";
                const canUnlock = status === "APPROVED" || status === "PENDING_APPROVAL";

                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{emp.avatar}</span>
                        <span style={{ fontWeight: "600" }}>{emp.name}</span>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{users.find(u => u.id === emp.reportingTo)?.name || "N/A"}</td>
                    <td>
                      <span className={`badge badge-${status.toLowerCase()}`}>
                        {status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {canUnlock ? (
                        <button
                          onClick={() => handleUnlockClick(emp.id)}
                          className="btn btn-secondary"
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            color: "var(--color-danger)",
                            borderColor: "var(--color-danger)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Unlock size={12} />
                          <span>Unlock Sheet</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                          No exception (Draft)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Trail Grid */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <History size={18} className="text-brand" style={{ color: "var(--color-brand)" }} />
          <span>Security Audit Trail (Goal modifications post-lock logs)</span>
        </h3>
        
        {audits.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "13.5px" }}>
            No administrative modifications or locked-sheet edits recorded yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {audits.map(audit => (
              <div 
                key={audit.id} 
                className="audit-log-item"
                style={{ paddingLeft: "24px" }}
              >
                <div className="audit-log-dot" style={{ left: "-4px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>
                      {audit.actionType}
                    </span>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {audit.details}
                    </p>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                      Executed by: <strong>{audit.userName}</strong> (ID: {audit.userId})
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {new Date(audit.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
