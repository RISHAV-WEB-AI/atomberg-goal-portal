import React from "react";
import { BarChart3, Download, Users, CheckCircle2, ShieldAlert, Award, Grid, PieChart } from "lucide-react";
import { calculateProgressScore } from "../data/mockStore";

export default function AnalyticsPortal({ currentUser, users, goals, sheets, onShowToast }) {
  
  // Real-time completion rates calculation
  const totalEmployees = users.filter(u => u.role === "Employee").length;
  const submittedSheetsCount = sheets.filter(s => s.status === "PENDING_APPROVAL" || s.status === "APPROVED").length;
  const approvedSheetsCount = sheets.filter(s => s.status === "APPROVED").length;

  const goalCompletionPercentage = totalEmployees > 0 
    ? Math.round((submittedSheetsCount / totalEmployees) * 100) 
    : 0;

  const approvalCompletionPercentage = totalEmployees > 0 
    ? Math.round((approvedSheetsCount / totalEmployees) * 100) 
    : 0;

  // Quarterly Check-ins capture rates
  const q1CompletedCount = goals.filter(g => g.actualQ1).length;
  const q1CompletionRate = goals.length > 0 ? Math.round((q1CompletedCount / goals.length) * 100) : 0;

  const q2CompletedCount = goals.filter(g => g.actualQ2).length;
  const q2CompletionRate = goals.length > 0 ? Math.round((q2CompletedCount / goals.length) * 100) : 0;

  // Exports data to CSV dynamically in Javascript
  const exportToCSV = () => {
    try {
      const headers = [
        "Employee ID",
        "Employee Name",
        "Department",
        "Goal Title",
        "Thrust Area",
        "UoM",
        "Target",
        "Q1 Actual",
        "Q1 Status",
        "Q1 Score",
        "Q2 Actual",
        "Q2 Status",
        "Q2 Score",
        "Q3 Actual",
        "Q3 Status",
        "Q3 Score",
        "Q4 Actual",
        "Q4 Status",
        "Q4 Score"
      ];

      const rows = [];

      goals.forEach(goal => {
        const emp = users.find(u => u.id === goal.userId);
        if (!emp) return;

        const scoreQ1 = goal.actualQ1 ? Math.round(calculateProgressScore(goal.uom, goal.target, goal.actualQ1) * 100) + "%" : "0%";
        const scoreQ2 = goal.actualQ2 ? Math.round(calculateProgressScore(goal.uom, goal.target, goal.actualQ2) * 100) + "%" : "0%";
        const scoreQ3 = goal.actualQ3 ? Math.round(calculateProgressScore(goal.uom, goal.target, goal.actualQ3) * 100) + "%" : "0%";
        const scoreQ4 = goal.actualQ4 ? Math.round(calculateProgressScore(goal.uom, goal.target, goal.actualQ4) * 100) + "%" : "0%";

        rows.push([
          emp.id,
          emp.name,
          emp.department,
          `"${goal.title.replace(/"/g, '""')}"`,
          goal.thrustArea,
          goal.uom,
          goal.target,
          goal.actualQ1 || "N/A",
          goal.statusQ1,
          scoreQ1,
          goal.actualQ2 || "N/A",
          goal.statusQ2,
          scoreQ2,
          goal.actualQ3 || "N/A",
          goal.statusQ3,
          scoreQ3,
          goal.actualQ4 || "N/A",
          goal.statusQ4,
          scoreQ4
        ]);
      });

      // Construct CSV content
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Atomberg_Goal_Achievement_Report_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast("success", "Achievement Report exported to Excel CSV successfully!");
    } catch (e) {
      onShowToast("error", "Failed to export report: " + e.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Analytics Main Header & Export button */}
      <div className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChart3 size={20} className="text-brand" style={{ color: "var(--color-brand)" }} />
            <span>Executive Governance & Analytics</span>
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Real-time visual monitoring of goal-setting sheets compliance and organizational completion trends.
          </p>
        </div>
        <button onClick={exportToCSV} className="btn btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Download size={16} />
          <span>Export Excel/CSV Report</span>
        </button>
      </div>

      {/* Numerical Metrics Summary Widgets */}
      <div className="dashboard-grid">
        {/* Metric 1 */}
        <div className="glass-panel metric-card" style={{ borderLeft: "5px solid var(--color-brand)" }}>
          <div className="metric-details">
            <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Goal Sheets Submitted</span>
            <h3>{goalCompletionPercentage}%</h3>
            <div className="progress-container" style={{ width: "120px", marginTop: "8px" }}>
              <div className="progress-fill progress-brand" style={{ width: `${goalCompletionPercentage}%` }} />
            </div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: "var(--color-brand-glow)" }}>
            <Users size={22} className="text-brand" style={{ color: "var(--color-brand)" }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel metric-card" style={{ borderLeft: "5px solid var(--color-success)" }}>
          <div className="metric-details">
            <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Sheets Manager Approved</span>
            <h3>{approvalCompletionPercentage}%</h3>
            <div className="progress-container" style={{ width: "120px", marginTop: "8px" }}>
              <div className="progress-fill progress-success" style={{ width: `${approvalCompletionPercentage}%` }} />
            </div>
          </div>
          <div className="metric-icon" style={{ backgroundColor: "var(--color-success-bg)" }}>
            <CheckCircle2 size={22} style={{ color: "var(--color-success)" }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel metric-card" style={{ borderLeft: "5px solid var(--color-info)" }}>
          <div className="metric-details">
            <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Q1 Capture Rate</span>
            <h3>{q1CompletionRate}%</h3>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
              {q1CompletedCount} goals updated
            </span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: "var(--color-info-bg)" }}>
            <Award size={22} style={{ color: "var(--color-info)" }} />
          </div>
        </div>
      </div>

      {/* Visual Graphs - Using high-fidelity SVGs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flexWrap: "wrap" }}>
        
        {/* SVG Graph 1: QoQ Goal Achievement trends */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <PieChart size={16} />
            <span>Quarter-on-Quarter (QoQ) Completion Rates</span>
          </h3>

          <div style={{ width: "100%", height: "240px", display: "flex", alignItems: "center", justify: "center" }}>
            <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              {/* Grid lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="var(--border-color)" strokeDasharray="3,3" />
              <line x1="40" y1="65" x2="380" y2="65" stroke="var(--border-color)" strokeDasharray="3,3" />
              <line x1="40" y1="110" x2="380" y2="110" stroke="var(--border-color)" strokeDasharray="3,3" />
              <line x1="40" y1="155" x2="380" y2="155" stroke="var(--border-color)" />

              {/* Y Axis labels */}
              <text x="30" y="24" fontSize="10" fill="var(--text-muted)" textAnchor="end">100%</text>
              <text x="30" y="69" fontSize="10" fill="var(--text-muted)" textAnchor="end">50%</text>
              <text x="30" y="114" fontSize="10" fill="var(--text-muted)" textAnchor="end">25%</text>
              <text x="30" y="159" fontSize="10" fill="var(--text-muted)" textAnchor="end">0%</text>

              {/* Bar 1 (Q1) */}
              <rect x="80" y={155 - (q1CompletionRate * 1.35)} width="35" height={q1CompletionRate * 1.35} fill="url(#brandGradient)" rx="4" />
              <text x="97" y="172" fontSize="11" fill="var(--text-secondary)" textAnchor="middle">Q1 (July)</text>
              <text x="97" y={145 - (q1CompletionRate * 1.35)} fontSize="11" fill="var(--text-primary)" fontWeight="700" textAnchor="middle">{q1CompletionRate}%</text>

              {/* Bar 2 (Q2) */}
              <rect x="160" y={155 - (q2CompletionRate * 1.35)} width="35" height={q2CompletionRate * 1.35} fill="url(#successGradient)" rx="4" />
              <text x="177" y="172" fontSize="11" fill="var(--text-secondary)" textAnchor="middle">Q2 (Oct)</text>
              <text x="177" y={145 - (q2CompletionRate * 1.35)} fontSize="11" fill="var(--text-primary)" fontWeight="700" textAnchor="middle">{q2CompletionRate}%</text>

              {/* Bar 3 (Q3) */}
              <rect x="240" y="150" width="35" height="5" fill="var(--border-color)" rx="2" />
              <text x="257" y="172" fontSize="11" fill="var(--text-secondary)" textAnchor="middle">Q3 (Jan)</text>
              <text x="257" y="140" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Locked</text>

              {/* Bar 4 (Q4) */}
              <rect x="320" y="150" width="35" height="5" fill="var(--border-color)" rx="2" />
              <text x="337" y="172" fontSize="11" fill="var(--text-secondary)" textAnchor="middle">Q4 (March)</text>
              <text x="337" y="140" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Locked</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand)" />
                  <stop offset="100%" stopColor="var(--color-brand-glow)" />
                </linearGradient>
                <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-success)" />
                  <stop offset="100%" stopColor="var(--color-success-bg)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* SVG Graph 2: Goal distributions by Thrust Area */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <Grid size={16} />
            <span>Thrust Area Goal Focus Distribution</span>
          </h3>

          <div style={{ width: "100%", height: "240px", display: "flex", alignItems: "center", justify: "center" }}>
            <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              {/* Visual Horizontal Grid charts */}
              {/* Innovation */}
              <text x="140" y="32" fontSize="11" fill="var(--text-secondary)" textAnchor="end">Innovation & Tech</text>
              <rect x="150" y="22" width="200" height="12" fill="var(--border-color)" rx="6" />
              <rect x="150" y="22" width="140" height="12" fill="var(--color-brand)" rx="6" />
              <text x="300" y="32" fontSize="11" fill="var(--text-primary)" fontWeight="700">4 Goals</text>

              {/* Energy Efficiency */}
              <text x="140" y="67" fontSize="11" fill="var(--text-secondary)" textAnchor="end">Energy Efficiency</text>
              <rect x="150" y="57" width="200" height="12" fill="var(--border-color)" rx="6" />
              <rect x="150" y="57" width="80" height="12" fill="var(--color-info)" rx="6" />
              <text x="240" y="67" fontSize="11" fill="var(--text-primary)" fontWeight="700">2 Goals</text>

              {/* Operational Excellence */}
              <text x="140" y="102" fontSize="11" fill="var(--text-secondary)" textAnchor="end">Operational Excellence</text>
              <rect x="150" y="92" width="200" height="12" fill="var(--border-color)" rx="6" />
              <rect x="150" y="92" width="110" height="12" fill="var(--color-success)" rx="6" />
              <text x="270" y="102" fontSize="11" fill="var(--text-primary)" fontWeight="700">3 Goals</text>

              {/* Customer Centricity */}
              <text x="140" y="137" fontSize="11" fill="var(--text-secondary)" textAnchor="end">Customer Centricity</text>
              <rect x="150" y="127" width="200" height="12" fill="var(--border-color)" rx="6" />
              <rect x="150" y="127" width="45" height="12" fill="var(--color-warning)" rx="6" />
              <text x="205" y="137" fontSize="11" fill="var(--text-primary)" fontWeight="700">1 Goal</text>
            </svg>
          </div>
        </div>

      </div>

      {/* Completion Dashboard Table view */}
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "700" }}>Organization Compliance Status</h3>
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Manager</th>
                <th>Goal Setting Sheet</th>
                <th>Q1 Progress Check-in</th>
                <th>Q2 Progress Check-in</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === "Employee").map(emp => {
                const sheet = sheets.find(s => s.userId === emp.id);
                const empGoals = goals.filter(g => g.userId === emp.id);
                const q1Done = empGoals.length > 0 && empGoals.every(g => g.actualQ1);
                const q2Done = empGoals.length > 0 && empGoals.every(g => g.actualQ2);

                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px" }}>{emp.avatar}</span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600" }}>{emp.name}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{emp.title}</span>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{users.find(u => u.id === emp.reportingTo)?.name || "N/A"}</td>
                    <td>
                      <span className={`badge ${sheet ? `badge-${sheet.status.toLowerCase()}` : 'badge-draft'}`}>
                        {sheet ? sheet.status.replace('_', ' ') : 'DRAFT'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12.5px", fontWeight: "600", color: q1Done ? "var(--color-success)" : "var(--color-warning)" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: q1Done ? "var(--color-success)" : "var(--color-warning)" }} />
                        <span>{q1Done ? "Completed" : "Overdue / Pending"}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12.5px", fontWeight: "600", color: q2Done ? "var(--color-success)" : "var(--color-warning)" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "9999px", backgroundColor: q2Done ? "var(--color-success)" : "var(--color-warning)" }} />
                        <span>{q2Done ? "Completed" : "Overdue / Pending"}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
