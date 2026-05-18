import React, { useState } from "react";
import { ShieldCheck, Cpu, Leaf, Zap, HelpCircle, UserPlus, LogIn, ArrowRight } from "lucide-react";
import { loginUser, registerUser } from "../data/mockStore";

export default function LandingPage({ onLoginSuccess, onShowToast }) {
  const [formType, setFormType] = useState("LOGIN"); // LOGIN or REGISTER
  const [roleType, setRoleType] = useState("Employee"); // Employee or Manager / Admin

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("R&D Engineering");
  const [registerRole, setRegisterRole] = useState("Employee");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      onShowToast("warning", "Please fill in all email and password fields.");
      return;
    }

    try {
      const loggedUser = loginUser(email, password);
      
      // Perform strict role category validation checks
      if (roleType === "Employee" && loggedUser.role !== "Employee") {
        onShowToast("error", "Access Denied: This email belongs to an Admin/Manager account. Please use the Executive Portal toggle.");
        return;
      }
      if (roleType === "Manager" && loggedUser.role === "Employee") {
        onShowToast("error", "Access Denied: This email belongs to an Employee account. Please use the Employee Portal toggle.");
        return;
      }

      onShowToast("success", `Azure AD Verified: Welcome back, ${loggedUser.name}!`);
      onLoginSuccess(loggedUser);
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !title) {
      onShowToast("warning", "Please fill in all required registration fields.");
      return;
    }

    try {
      const newUser = registerUser(
        name, 
        email, 
        password, 
        registerRole, 
        title, 
        department,
        registerRole === "Employee" ? "U002" : "U001", // Rajesh as manager or Vikram as Admin
        registerRole === "Employee" ? "👩‍💻" : "👨‍💼"
      );
      onShowToast("success", `Corporate Account created! Welcome, ${newUser.name}.`);
      onLoginSuccess(newUser);
    } catch (err) {
      onShowToast("error", err.message);
    }
  };

  const fillPreseedCredentials = (presetEmail) => {
    setEmail(presetEmail);
    setPassword("password123");
    onShowToast("info", `Pre-filled sandbox credentials for: ${presetEmail}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", position: "relative", overflowX: "hidden" }}>
      
      {/* Background radial glow */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", borderRadius: "9999px", background: "radial-gradient(circle, rgba(255, 90, 31, 0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "50%", borderRadius: "9999px", background: "radial-gradient(circle, rgba(255, 90, 31, 0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Branded Header */}
      <header style={{ padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", backdropFilter: "blur(8px)", zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "var(--color-brand)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px var(--color-brand)" }}>
            <span style={{ fontSize: "20px", fontWeight: "900", color: "white" }}>a</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase" }}>atomberg</span>
            <span style={{ fontSize: "9px", color: "var(--color-brand)", fontWeight: "700", letterSpacing: "1.5px" }}>PERFORMANCE CORNER</span>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "24px", fontSize: "13.5px" }} className="hide-mobile">
          <a href="#about" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--color-brand)"} onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}>BLDC Technology</a>
          <a href="#portal" style={{ color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--color-brand)"} onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}>Portal Guidelines</a>
        </div>
      </header>

      {/* Main split viewport layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", flex: 1, padding: "40px 48px", gap: "40px", zIndex: 5, maxWidth: "1400px", margin: "0 auto", width: "100%", alignContent: "center" }}>
        
        {/* Left Column: Corporate & Engineering Values */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "32px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--color-brand)", backgroundColor: "var(--color-brand-glow)", padding: "4px 12px", borderRadius: "9999px", display: "inline-block" }}>
              Pioneers of Smart Motor Technology
            </span>
            <h1 style={{ fontSize: "42px", fontWeight: "900", lineHeight: "1.2", marginTop: "16px", letterSpacing: "-1px" }}>
              Redefining Appraisals Through <span className="text-brand" style={{ color: "var(--color-brand)" }}>Engineering Precision.</span>
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6", marginTop: "16px" }}>
              Welcome to the Atomberg In-House Goal Setting & Appraisal Portal. We sync departmental objectives, evaluate numerical engineering metrics, and enforce strict, rule-based appraisal governance.
            </p>
          </div>

          {/* Key Firm Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                <Cpu size={18} className="text-brand" style={{ color: "var(--color-brand)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Pioneering BLDC Motors</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>We replace standard heavy induction coils with compact, highly reliable brushless DC motors.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                <Leaf size={18} style={{ color: "var(--color-success)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700" }}>65% Energy Savings</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>Our fans consume only 28W instead of 75W, significantly cutting carbon footprints.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                <Zap size={18} style={{ color: "var(--color-info)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Appraisal Integrity</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>Enforcing weightage sum targets, timeline checks, and real-time cascaded synch.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                <ShieldCheck size={18} style={{ color: "var(--color-brand)" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: "700" }}>Tamper-Proof Auditing</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>Post-lock modifications log changes automatically inside our HR security trails.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Login/Register card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "450px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            
            {/* Form Type Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
              <button 
                onClick={() => setFormType("LOGIN")}
                style={{ flex: 1, padding: "14px", border: "none", background: "none", color: formType === "LOGIN" ? "var(--color-brand)" : "var(--text-secondary)", borderBottom: formType === "LOGIN" ? "2px solid var(--color-brand)" : "none", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
              >
                Sign In
              </button>
              <button 
                onClick={() => setFormType("REGISTER")}
                style={{ flex: 1, padding: "14px", border: "none", background: "none", color: formType === "REGISTER" ? "var(--color-brand)" : "var(--text-secondary)", borderBottom: formType === "REGISTER" ? "2px solid var(--color-brand)" : "none", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
              >
                Register Employee
              </button>
            </div>

            {formType === "LOGIN" ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Corporate Single Sign-On</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Select your corporate domain role and enter your seeded credentials to enter.
                  </p>
                </div>

                {/* Role Tabs */}
                <div style={{ display: "flex", gap: "10px", backgroundColor: "var(--bg-tertiary)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <button
                    type="button"
                    onClick={() => { setRoleType("Employee"); setEmail(""); }}
                    style={{ flex: 1, padding: "8px", border: "none", borderRadius: "6px", backgroundColor: roleType === "Employee" ? "var(--bg-primary)" : "transparent", color: roleType === "Employee" ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: "600", fontSize: "12.5px", cursor: "pointer" }}
                  >
                    Employee Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRoleType("Manager"); setEmail(""); }}
                    style={{ flex: 1, padding: "8px", border: "none", borderRadius: "6px", backgroundColor: roleType === "Manager" ? "var(--bg-primary)" : "transparent", color: roleType === "Manager" ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: "600", fontSize: "12.5px", cursor: "pointer" }}
                  >
                    Executive / Manager
                  </button>
                </div>

                {/* Form fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600" }}>Corporate Email</label>
                  <input
                    type="email"
                    placeholder={roleType === "Employee" ? "employee@atomberg.com" : "manager@atomberg.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600" }}>SSO Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                {/* Preseed suggest cards */}
                <div>
                  <span style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                    💡 Sandbox Seed Account Shortcuts (Click to Auto-fill):
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {roleType === "Employee" ? (
                      <>
                        <button type="button" onClick={() => fillPreseedCredentials("employee@atomberg.com")} className="badge badge-draft" style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}>
                          Ananya (Employee)
                        </button>
                        <button type="button" onClick={() => fillPreseedCredentials("kabir@atomberg.com")} className="badge badge-draft" style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}>
                          Kabir (Employee 2)
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => fillPreseedCredentials("manager@atomberg.com")} className="badge badge-draft" style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}>
                          Rajesh (Manager)
                        </button>
                        <button type="button" onClick={() => fillPreseedCredentials("admin@atomberg.com")} className="badge badge-draft" style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}>
                          Vikram (HR/Admin)
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "8px", width: "100%", justifyContent: "center" }}>
                  <LogIn size={16} />
                  <span>Verify SSO & Enter Portal</span>
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Register Corporate Account</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Newly registered employees automatically get assigned to Rajesh Iyer (L1) with a blank DRAFT goals sheet initialized.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Access Role</label>
                    <select
                      value={registerRole}
                      onChange={(e) => setRegisterRole(e.target.value)}
                      className="form-select"
                      style={{ padding: "10px", fontSize: "13px", height: "42px", backgroundColor: "var(--bg-primary)" }}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">HR Admin</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Corporate Email</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@atomberg.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>SSO Password</label>
                  <input
                    type="password"
                    placeholder="Secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Designation Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Firmware Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Department</label>
                    <input
                      type="text"
                      placeholder="e.g. R&D Engineering"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }}>
                  <UserPlus size={16} />
                  <span>Create & Initialize Account</span>
                </button>
              </form>
            )}

            {/* SSO Footer note */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11.5px", color: "var(--text-muted)", borderTop: "1px dashed var(--border-color)", paddingTop: "12px" }}>
              <ShieldCheck size={14} style={{ color: "var(--color-success)" }} />
              <span>Microsoft Entra ID Unified Directory SSO</span>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Info Foot */}
      <footer style={{ padding: "20px 48px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)", zIndex: 10, flexShrink: 0 }}>
        <span>© {new Date().getFullYear()} Atomberg Technologies Ltd. All rights reserved.</span>
        <span>Secure Performance Analytics Center</span>
      </footer>

    </div>
  );
}
