// Relational Mock Database persisting to localStorage for ultimate demo stability.

const SEED_USERS = [
  {
    id: "U001",
    name: "Vikram Malhotra",
    email: "admin@atomberg.com",
    role: "Admin",
    title: "Chief HR Officer & VP Operations",
    department: "People Operations",
    reportingTo: "Board of Directors",
    avatar: "👨‍💼",
    password: "password123"
  },
  {
    id: "U002",
    name: "Rajesh Iyer",
    email: "manager@atomberg.com",
    role: "Manager",
    title: "Director - R&D Engineering",
    department: "R&D Engineering",
    reportingTo: "U001",
    avatar: "👨‍🔬",
    password: "password123"
  },
  {
    id: "U003",
    name: "Ananya Sen",
    email: "employee@atomberg.com",
    role: "Employee",
    title: "Lead Power Electronics Engineer",
    department: "R&D Engineering",
    reportingTo: "U002",
    avatar: "👩‍💻",
    password: "password123"
  },
  {
    id: "U004",
    name: "Kabir Mehta",
    email: "kabir@atomberg.com",
    role: "Employee",
    title: "Senior Embedded Systems Engineer",
    department: "R&D Engineering",
    reportingTo: "U002",
    avatar: "🧑‍💻",
    password: "password123"
  }
];

const SEED_GOALS = [
  {
    id: "G_ANANYA_1",
    userId: "U003",
    thrustArea: "Innovation & Technology",
    title: "High-Efficiency Motor Controller Core V2",
    description: "Design, simulate, and prototype the next-gen motor controller board to achieve 98.2% inverter efficiency.",
    uom: "%",
    target: "98.2",
    weightage: 30,
    actualQ1: "",
    statusQ1: "Not Started",
    actualQ2: "",
    statusQ2: "Not Started",
    actualQ3: "",
    statusQ3: "Not Started",
    actualQ4: "",
    statusQ4: "Not Started",
    isShared: false
  },
  {
    id: "G_ANANYA_2",
    userId: "U003",
    thrustArea: "Energy Efficiency",
    title: "Reduce BLDC Standby Power",
    description: "Re-engineer BLDC standby power architecture to bring active sleep consumption below 0.3 Watts.",
    uom: "Numeric",
    target: "0.3",
    weightage: 30,
    actualQ1: "",
    statusQ1: "Not Started",
    actualQ2: "",
    statusQ2: "Not Started",
    actualQ3: "",
    statusQ3: "Not Started",
    actualQ4: "",
    statusQ4: "Not Started",
    isShared: false
  },
  {
    id: "G_ANANYA_3",
    userId: "U003",
    thrustArea: "Operational Excellence",
    title: "Complete Thermal Chamber Testing",
    description: "Conduct high-temperature testing protocols for the alpha controller series on schedule.",
    uom: "Timeline",
    target: "2026-07-25", // July 25 deadline
    weightage: 20,
    actualQ1: "",
    statusQ1: "Not Started",
    actualQ2: "",
    statusQ2: "Not Started",
    actualQ3: "",
    statusQ3: "Not Started",
    actualQ4: "",
    statusQ4: "Not Started",
    isShared: false
  },
  {
    id: "G_ANANYA_4",
    userId: "U003",
    thrustArea: "Customer Centricity",
    title: "Zero Field Failure Issues (Controller Series)",
    description: "Sustain strict Quality Assurance metrics on high voltage surges.",
    uom: "Zero-based",
    target: "0",
    weightage: 20,
    actualQ1: "",
    statusQ1: "Not Started",
    actualQ2: "",
    statusQ2: "Not Started",
    actualQ3: "",
    statusQ3: "Not Started",
    actualQ4: "",
    statusQ4: "Not Started",
    isShared: false
  }
];

// Departmental KPI Goal owned by Manager (Rajesh) which can be cascaded
const SEED_MANAGER_GOALS = [
  {
    id: "G_RAJESH_KPI_1",
    userId: "U002",
    thrustArea: "Operational Excellence",
    title: "R&D Cycle Time Reductions (Departmental)",
    description: "Reduce engineering turnaround time for motor prototypes from 45 days to 30 days.",
    uom: "Numeric",
    target: "30",
    weightage: 40,
    actualQ1: "",
    statusQ1: "Not Started",
    actualQ2: "",
    statusQ2: "Not Started",
    actualQ3: "",
    statusQ3: "Not Started",
    actualQ4: "",
    statusQ4: "Not Started",
    isShared: true,
    isCascadeOrigin: true
  }
];

const SEED_SHEETS = [
  {
    id: "S_ANANYA",
    userId: "U003",
    year: "2026-27",
    status: "DRAFT",
    submittedAt: null,
    approvedAt: null,
    comment: ""
  },
  {
    id: "S_KABIR",
    userId: "U004",
    year: "2026-27",
    status: "DRAFT",
    submittedAt: null,
    approvedAt: null,
    comment: ""
  },
  {
    id: "S_RAJESH",
    userId: "U002",
    year: "2026-27",
    status: "APPROVED",
    submittedAt: "2026-05-02T10:00:00Z",
    approvedAt: "2026-05-03T11:00:00Z",
    comment: "Pre-approved corporate sheets."
  }
];

const STORAGE_KEYS = {
  USERS: "atomberg_users",
  GOALS: "atomberg_goals",
  SHEETS: "atomberg_sheets",
  AUDITS: "atomberg_audits",
  NOTIFICATIONS: "atomberg_notifications",
  SYSTEM_DATE: "atomberg_system_date",
  ESCALATIONS: "atomberg_escalations"
};

// Initial store state getter
export const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  } else {
    // Auto-migration for legacy name-based reportingTo strings
    try {
      const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
      let mutated = false;
      const updatedUsers = storedUsers.map(u => {
        if (u.reportingTo === "Rajesh Iyer") {
          u.reportingTo = "U002";
          mutated = true;
        } else if (u.reportingTo === "Vikram Malhotra") {
          u.reportingTo = "U001";
          mutated = true;
        }
        return u;
      });
      if (mutated) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      }
    } catch (e) {
      console.error("Migration error for user manager IDs: ", e);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
    // Merge Ananya goals and Rajesh departmental goal
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([...SEED_GOALS, ...SEED_MANAGER_GOALS]));
  } else {
    // Clean up duplicate goals resulting from the legacy saveGoalSheet filter bug
    try {
      const storedGoals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS)) || [];
      const seenIds = new Set();
      const seenShared = new Set();
      const cleanedGoals = [];
      let mutated = false;
      
      storedGoals.forEach(g => {
        if (!g.id) {
          mutated = true;
          return;
        }
        if (seenIds.has(g.id)) {
          mutated = true;
          return; // Duplicate ID
        }
        
        if (g.isShared && g.sharedFromGoalId) {
          const sharedKey = `${g.userId}_${g.sharedFromGoalId}`;
          if (seenShared.has(sharedKey)) {
            mutated = true;
            return; // Duplicate cascaded goal for this employee
          }
          seenShared.add(sharedKey);
        }
        
        seenIds.add(g.id);
        cleanedGoals.push(g);
      });
      
      if (mutated) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(cleanedGoals));
      }
    } catch (e) {
      console.error("Migration error for duplicate goals cleanup: ", e);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHEETS)) {
    localStorage.setItem(STORAGE_KEYS.SHEETS, JSON.stringify(SEED_SHEETS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDITS)) {
    localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_DATE)) {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_DATE, "2026-05-15"); // May 15, Goal Creation Cycle open
  }
  if (!localStorage.getItem(STORAGE_KEYS.ESCALATIONS)) {
    localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify([]));
  }
};


// Raw Local Storage Helpers
const getStorageItem = (key) => JSON.parse(localStorage.getItem(key));
const setStorageItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Core Getters
export const getUsers = () => getStorageItem(STORAGE_KEYS.USERS) || [];
export const getGoals = () => getStorageItem(STORAGE_KEYS.GOALS) || [];
export const getSheets = () => getStorageItem(STORAGE_KEYS.SHEETS) || [];
export const getAudits = () => getStorageItem(STORAGE_KEYS.AUDITS) || [];
export const getNotifications = () => getStorageItem(STORAGE_KEYS.NOTIFICATIONS) || [];
export const getSystemDate = () => localStorage.getItem(STORAGE_KEYS.SYSTEM_DATE) || "2026-05-15";
export const getEscalations = () => getStorageItem(STORAGE_KEYS.ESCALATIONS) || [];

// Date Utilities & Cycle Determiners
export const getActiveCycle = (dateString = getSystemDate()) => {
  const date = new Date(dateString);
  const month = date.getMonth(); // 0 = Jan, 4 = May, 6 = July, 9 = Oct, 2 = March

  if (month === 4 || month === 5) {
    return {
      id: "PHASE_1",
      name: "Phase 1 - Goal Setting & Approval",
      range: "1st May - 30th June",
      code: "Goal Creation",
      quarter: "Q0"
    };
  } else if (month === 6 || month === 7 || month === 8) {
    return {
      id: "Q1",
      name: "Q1 Progress Update",
      range: "1st July - 30th September",
      code: "Q1",
      quarter: "Q1"
    };
  } else if (month === 9 || month === 10 || month === 11) {
    return {
      id: "Q2",
      name: "Q2 Progress Update",
      range: "1st October - 31st December",
      code: "Q2",
      quarter: "Q2"
    };
  } else if (month === 0 || month === 1) {
    return {
      id: "Q3",
      name: "Q3 Progress Update",
      range: "1st January - 28th February",
      code: "Q3",
      quarter: "Q3"
    };
  } else {
    return {
      id: "Q4",
      name: "Q4 / Annual Achievement Capture",
      range: "1st March - 30th April",
      code: "Q4",
      quarter: "Q4"
    };
  }
};

// Save simulated system date and run background rule escalations
export const updateSystemDate = (newDate) => {
  localStorage.setItem(STORAGE_KEYS.SYSTEM_DATE, newDate);
  runEscalationCheck(newDate);
};

// Logging System Triggers
export const logNotification = (type, recipient, title, content) => {
  const logs = getNotifications();
  const newLog = {
    id: `NL_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type,
    recipient,
    title,
    content,
    isRead: false
  };
  logs.unshift(newLog);
  setStorageItem(STORAGE_KEYS.NOTIFICATIONS, logs);
};

export const logAudit = (userId, userName, actionType, details) => {
  const audits = getAudits();
  const newAudit = {
    id: `AD_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    actionType,
    details
  };
  audits.unshift(newAudit);
  setStorageItem(STORAGE_KEYS.AUDITS, audits);
};

// Math score calculations based on UoM formulas
export const calculateProgressScore = (uom, targetVal, achievementVal) => {
  if (achievementVal === undefined || achievementVal === null || achievementVal === "") return 0;
  const achievement = parseFloat(achievementVal);
  const target = parseFloat(targetVal);

  if (isNaN(achievement)) return 0;

  switch (uom) {
    case "Numeric":
    case "%":
      // Supports Higher is Better (Min target, e.g. Sales Revenue)
      // or Lower is Better (Max target, e.g. TAT, cost).
      // We will distinguish by looking at targets, or let's assume default is Higher is better, 
      // EXCEPT when target is labeled or identified as Max/TAT/Failure/etc.
      // Wait, the BRD formula says:
      // Min (Numeric / %) (Higher is better) -> Achievement ÷ Target
      // Max (Numeric / %) (Lower is better)  -> Target ÷ Achievement
      // Let's assume: If the UoM includes the words "TAT", "Cost", "Incident", "Failure", "Incident rate", "Defect", "Time to resolution"
      // then lower is better (Max UoM type). Otherwise, default is Higher is better (Min UoM type).
      if (target === 0) return 0;
      return achievement / target;
      
    case "Timeline":
      // Completion date vs Deadline.
      // E.g. target is "2026-07-25".
      // If achievement (completion date) is on or before target, score is 100% (1.0).
      // If after, decrease score (e.g. 5% reduction per day late, or simple binary 1 or 0).
      // Let's implement dynamic calculation:
      try {
        const targetDate = new Date(targetVal);
        const completionDate = new Date(achievementVal);
        if (isNaN(targetDate.getTime()) || isNaN(completionDate.getTime())) return 0;
        
        if (completionDate <= targetDate) {
          return 1.0; // 100%
        } else {
          // Late penalty: reduce by 5% per day, minimum 0
          const diffTime = Math.abs(completionDate - targetDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const score = 1.0 - (diffDays * 0.05);
          return Math.max(0, score);
        }
      } catch (e) {
        return 0;
      }

    case "Zero-based":
      // Zero = Success. If achievement === 0 -> 100%, else 0%
      return achievement === 0 ? 1.0 : 0.0;

    default:
      return 0;
  }
};

// Core Business Logics & DB Mutators

// 1. Employee: Save goals (DRAFT state)
export const saveGoalSheet = (userId, goalItems) => {
  const goals = getGoals();
  const sheets = getSheets();
  
  // Filter out ALL existing goals of the employee (both regular and shared)
  const otherGoals = goals.filter(g => g.userId !== userId);
  
  // Save new goal draft items
  const updatedGoalItems = goalItems.map(g => {
    const updatedGoal = { ...g };
    if (!updatedGoal.id) {
      updatedGoal.id = `G_${userId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    // Ensure userId is ALWAYS set correctly for the employee's goals!
    updatedGoal.userId = userId;
    return updatedGoal;
  });

  const finalGoals = [...otherGoals, ...updatedGoalItems];
  setStorageItem(STORAGE_KEYS.GOALS, finalGoals);

  // Update or insert sheet
  const sheetIndex = sheets.findIndex(s => s.userId === userId);
  const now = new Date().toISOString();
  if (sheetIndex > -1) {
    sheets[sheetIndex].status = "DRAFT";
  } else {
    sheets.push({
      id: `S_${userId}`,
      userId,
      year: "2026-27",
      status: "DRAFT",
      submittedAt: null,
      approvedAt: null,
      comment: ""
    });
  }
  setStorageItem(STORAGE_KEYS.SHEETS, sheets);
  return updatedGoalItems;
};

// 2. Employee: Submit goals for manager review (Validations enforced!)
export const submitGoalSheet = (userId, goalItems) => {
  // Guard validation rules
  if (goalItems.length === 0) {
    throw new Error("You must add at least one goal.");
  }
  if (goalItems.length > 8) {
    throw new Error("Maximum number of goals per employee is 8.");
  }

  // Calculate total weightage
  const totalWeightage = goalItems.reduce((sum, g) => sum + parseFloat(g.weightage || 0), 0);
  if (Math.abs(totalWeightage - 100) > 0.01) {
    throw new Error(`Total goal weightage must equal exactly 100%. Currently it is ${totalWeightage}%.`);
  }

  // Individual min weight check
  const lowWeightGoals = goalItems.filter(g => parseFloat(g.weightage || 0) < 10);
  if (lowWeightGoals.length > 0) {
    throw new Error("Minimum weightage per individual goal must be 10%. Please adjust.");
  }

  // Step 1: Save the goals first
  const savedItems = saveGoalSheet(userId, goalItems);

  // Step 2: Lock into PENDING_APPROVAL status
  const sheets = getSheets();
  const sheetIndex = sheets.findIndex(s => s.userId === userId);
  const now = new Date().toISOString();
  if (sheetIndex > -1) {
    sheets[sheetIndex].status = "PENDING_APPROVAL";
    sheets[sheetIndex].submittedAt = now;
  }
  setStorageItem(STORAGE_KEYS.SHEETS, sheets);

  // Trigger Notifications: Teams Adaptive Card and Email to L1 Manager (Rajesh)
  const employee = getUsers().find(u => u.id === userId);
  const manager = getUsers().find(u => u.id === employee.reportingTo);

  if (manager) {
    const emailSubject = `[Goal Submission] Action Required: Review Goals for ${employee.name}`;
    const emailContent = `
      <h3>Goal Approval Request</h3>
      <p>Hello ${manager.name},</p>
      <p>Your team member <strong>${employee.name}</strong> has submitted their goal sheet for the <strong>2026-27 Cycle</strong>.</p>
      <p>Total Weightage: 100% | Goals Count: ${goalItems.length}</p>
      <p>Please log into the Atomberg Portal to review, edit targets inline, or approve their sheet.</p>
      <hr/>
      <small>This is an automated message from Atomberg People Ops.</small>
    `;
    logNotification("EMAIL", manager.email, emailSubject, emailContent);

    // Microsoft Teams Adaptive Card
    const teamsTitle = `🎯 New Goal Sheet Pending Approval`;
    const teamsContent = `
      **Employee**: ${employee.name} (${employee.title})
      **Department**: ${employee.department}
      **Goal Count**: ${goalItems.length}
      **Total Weightage**: 100%
      
      *Rajesh, please review and approve or return for rework.*
      
      [View Goal Sheet - Deep Link](http://atomberg.portal/sheets/${userId})
    `;
    logNotification("TEAMS", manager.email, teamsTitle, teamsContent);
  }

  return savedItems;
};

// 3. Manager: Inline edits of employee targets / weightages during approval
export const updateEmployeeGoalInline = (employeeId, goalId, updatedFieldValues, managerUser) => {
  const goals = getGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId && g.userId === employeeId);
  if (goalIndex === -1) throw new Error("Goal not found.");

  const oldGoal = { ...goals[goalIndex] };
  
  // Merge field changes
  goals[goalIndex] = { ...goals[goalIndex], ...updatedFieldValues };
  setStorageItem(STORAGE_KEYS.GOALS, goals);

  // Audit trail log
  let details = `Manager ${managerUser.name} modified goal "${oldGoal.title}": `;
  Object.keys(updatedFieldValues).forEach(key => {
    details += `[${key}] changed from "${oldGoal[key]}" to "${updatedFieldValues[key]}". `;
  });

  logAudit(managerUser.id, managerUser.name, "INLINE_EDIT", details);
};

// 4. Manager: Approve goal sheet (locks sheet) or Return for Rework
export const approveGoalSheet = (employeeId, status, managerComment, managerUser) => {
  const sheets = getSheets();
  const sheetIndex = sheets.findIndex(s => s.userId === employeeId);
  if (sheetIndex === -1) throw new Error("Goal sheet not found.");

  const employee = getUsers().find(u => u.id === employeeId);
  const now = new Date().toISOString();

  sheets[sheetIndex].status = status;
  sheets[sheetIndex].comment = managerComment;
  if (status === "APPROVED") {
    sheets[sheetIndex].approvedAt = now;
  }
  setStorageItem(STORAGE_KEYS.SHEETS, sheets);

  // Audit and Notifications triggers
  const actionText = status === "APPROVED" ? "Approved" : "Returned for Rework";
  logAudit(managerUser.id, managerUser.name, status === "APPROVED" ? "SHEET_APPROVAL" : "SHEET_REWORK", `Goal sheet for ${employee.name} was ${actionText}. Comment: "${managerComment}"`);

  // Send Email & Teams notifications to Employee (Ananya)
  const emailSubject = `[Goal Portal] Your Goal Sheet has been ${actionText}`;
  const emailContent = `
    <h3>Goal Sheet Status Update</h3>
    <p>Hello ${employee.name},</p>
    <p>Your manager <strong>${managerUser.name}</strong> has reviewed your goal sheet and updated the status to <strong>${status}</strong>.</p>
    <p><strong>Manager feedback/comment:</strong> "${managerComment || "No comment provided."}"</p>
    <p>${status === "APPROVED" ? "Your goals are now locked. No further modifications can be made without HR/Admin support." : "Please log into the portal, make the requested adjustments, and re-submit for review."}</p>
    <hr/>
    <small>Atomberg Goal System Core</small>
  `;
  logNotification("EMAIL", employee.email, emailSubject, emailContent);

  const teamsTitle = `🎯 Goal Sheet ${actionText}`;
  const teamsContent = `
    Your manager **${managerUser.name}** has updated your goal sheet status to **${status}**.
    **Feedback**: "${managerComment || "None"}"
    ${status === "APPROVED" ? "🔐 Goals locked for this appraisal cycle." : "✏️ Please review changes and re-submit."}
  `;
  logNotification("TEAMS", employee.email, teamsTitle, teamsContent);
};

// 5. Admin: Unlock a locked goal sheet
export const unlockGoalSheet = (employeeId, adminUser) => {
  const sheets = getSheets();
  const sheetIndex = sheets.findIndex(s => s.userId === employeeId);
  if (sheetIndex === -1) throw new Error("Goal sheet not found.");

  sheets[sheetIndex].status = "DRAFT"; // Send back to draft so user can edit
  setStorageItem(STORAGE_KEYS.SHEETS, sheets);

  logAudit(adminUser.id, adminUser.name, "SHEET_UNLOCK", `Unlocked goal sheet for employee ID ${employeeId}. Status reset to DRAFT.`);

  // Send Notification to Employee
  const employee = getUsers().find(u => u.id === employeeId);
  if (employee) {
    const emailSubject = `[Goal Portal] Action Required: Goal Sheet UNLOCKED by Admin`;
    const emailContent = `
      <h3>Goal Sheet Unlocked</h3>
      <p>Hello ${employee.name},</p>
      <p>Your goal sheet has been unlocked by HR Admin <strong>${adminUser.name}</strong>.</p>
      <p>You can now log in, make changes, and re-submit it for approval.</p>
    `;
    logNotification("EMAIL", employee.email, emailSubject, emailContent);
  }
};

// 6. Admin / Manager: Push a Departmental KPI (Cascade Goal) to employees
export const cascadeSharedGoal = (sourceGoalId, recipientUserIds, creatorUser) => {
  const goals = getGoals();
  const sourceGoal = goals.find(g => g.id === sourceGoalId);
  if (!sourceGoal) throw new Error("Source KPI goal not found.");

  recipientUserIds.forEach(recipientId => {
    // Check if employee already has this cascaded goal
    const exists = goals.some(g => g.userId === recipientId && g.sharedFromGoalId === sourceGoalId);
    if (!exists) {
      // Create new goal item linked to source
      const cascadedGoal = {
        id: `G_CASCADE_${recipientId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: recipientId,
        thrustArea: sourceGoal.thrustArea,
        title: sourceGoal.title,
        description: sourceGoal.description,
        uom: sourceGoal.uom,
        target: sourceGoal.target,
        weightage: 10, // Default 10% (can adjust weightage only)
        actualQ1: sourceGoal.actualQ1 || "",
        statusQ1: sourceGoal.statusQ1 || "Not Started",
        actualQ2: sourceGoal.actualQ2 || "",
        statusQ2: sourceGoal.statusQ2 || "Not Started",
        actualQ3: sourceGoal.actualQ3 || "",
        statusQ3: sourceGoal.statusQ3 || "Not Started",
        actualQ4: sourceGoal.actualQ4 || "",
        statusQ4: sourceGoal.statusQ4 || "Not Started",
        isShared: true,
        sharedFromGoalId: sourceGoalId,
        sharedOwnerId: sourceGoal.userId
      };
      
      // We need to fetch recipient sheet to see if we should auto-inject or warning
      goals.push(cascadedGoal);
    }
  });

  setStorageItem(STORAGE_KEYS.GOALS, goals);
  logAudit(creatorUser.id, creatorUser.name, "KPI_CASCADE", `Cascaded Departmental KPI "${sourceGoal.title}" to employees: ${recipientUserIds.join(', ')}`);

  // Notifications
  recipientUserIds.forEach(id => {
    const employee = getUsers().find(u => u.id === id);
    if (employee) {
      logNotification("EMAIL", employee.email, `[New KPI Cascaded] corporate goal assigned`, `Hello ${employee.name}, a new shared departmental KPI "${sourceGoal.title}" has been assigned to your goals sheet. You can adjust the weightage, but Title and Targets are read-only.`);
    }
  });
};

// 7. Q1-Q4 checkin achievement logging (with automatic cascading synchronizations!)
export const updateGoalAchievement = (goalId, quarter, actualValue, statusVal, employeeUser) => {
  const goals = getGoals();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex === -1) throw new Error("Goal not found.");

  const goal = goals[goalIndex];
  
  // Set actual and status
  goal[`actual${quarter}`] = actualValue;
  goal[`status${quarter}`] = statusVal;

  // Real-time synchronization check:
  // "Achievement updates by the primary owner sync across all linked goal sheets"
  if (goal.isCascadeOrigin || (goal.isShared && !goal.sharedFromGoalId)) {
    // This is the primary owner updating the goal! Find all linked goals and update achievements
    goals.forEach((g, idx) => {
      if (g.sharedFromGoalId === goal.id) {
        goals[idx][`actual${quarter}`] = actualValue;
        goals[idx][`status${quarter}`] = statusVal;
      }
    });
  }

  setStorageItem(STORAGE_KEYS.GOALS, goals);
  
  logAudit(employeeUser.id, employeeUser.name, "ACHIEVEMENT_UPDATE", `Updated ${quarter} achievement for goal "${goal.title}" to "${actualValue}" (Status: ${statusVal})`);
};

// 8. Manager quarterly check-in structured comments
export const saveManagerCheckinComment = (employeeId, quarter, managerComment, managerUser) => {
  const sheets = getSheets();
  const sheetIndex = sheets.findIndex(s => s.userId === employeeId);
  if (sheetIndex === -1) throw new Error("Employee sheet not found.");

  // Save comments inside sheet structure
  const sheet = sheets[sheetIndex];
  if (!sheet.checkinComments) {
    sheet.checkinComments = {};
  }
  sheet.checkinComments[quarter] = {
    comment: managerComment,
    updatedAt: new Date().toISOString(),
    managerName: managerUser.name
  };

  setStorageItem(STORAGE_KEYS.SHEETS, sheets);
  logAudit(managerUser.id, managerUser.name, "CHECKIN_COMMENT", `Saved ${quarter} check-in feedback for employee ID ${employeeId}. Feedback: "${managerComment}"`);

  // Notification to employee
  const employee = getUsers().find(u => u.id === employeeId);
  if (employee) {
    logNotification("EMAIL", employee.email, `[Manager Feedback] ${quarter} check-in comment logged`, `Hi ${employee.name}, your manager ${managerUser.name} has added structured feedback for your ${quarter} performance check-in.`);
  }
};

// 9. Automated Rule-Based Escalation Engine
export const runEscalationCheck = (currentSimDate = getSystemDate()) => {
  const today = new Date(currentSimDate);
  const month = today.getMonth(); // 0-11
  const day = today.getDate();

  const users = getUsers();
  const sheets = getSheets();
  const goals = getGoals();
  const escalations = [];

  // Escalation rule 1: Goal setting submission check. Due by May 25
  if (month === 4 && day >= 25) { // May 25 onwards
    users.forEach(u => {
      if (u.role === "Employee") {
        const sheet = sheets.find(s => s.userId === u.id);
        if (!sheet || sheet.status === "DRAFT" || sheet.status === "REWORK") {
          escalations.push({
            id: `ESC_1_${u.id}`,
            employeeName: u.name,
            employeeId: u.id,
            managerName: users.find(m => m.id === u.reportingTo)?.name || "N/A",
            ruleTriggered: "Goal Creation Submission Overdue (May 25 Deadline)",
            severity: "HIGH",
            timestamp: today.toISOString(),
            status: "Auto-Escalated to L1 & HR"
          });
        }
      }
    });
  }

  // Escalation rule 2: Manager Goal Approval check. Due by June 5
  if (month === 5 && day >= 5) { // June 5 onwards
    users.forEach(u => {
      if (u.role === "Employee") {
        const sheet = sheets.find(s => s.userId === u.id);
        if (sheet && sheet.status === "PENDING_APPROVAL") {
          escalations.push({
            id: `ESC_2_${u.id}`,
            employeeName: u.name,
            employeeId: u.id,
            managerName: users.find(m => m.id === u.reportingTo)?.name || "N/A",
            ruleTriggered: "Manager Goal Approval Overdue (June 5 Deadline)",
            severity: "MEDIUM",
            timestamp: today.toISOString(),
            status: "Escalated to Manager & skip-level HR"
          });
        }
      }
    });
  }

  // Escalation rule 3: Q1 Check-in Capture Overdue. Due by August 10
  if (month === 7 && day >= 10) { // Aug 10 onwards
    users.forEach(u => {
      if (u.role === "Employee") {
        const userGoals = goals.filter(g => g.userId === u.id);
        const q1Empty = userGoals.some(g => !g.actualQ1);
        if (q1Empty) {
          escalations.push({
            id: `ESC_3_Q1_${u.id}`,
            employeeName: u.name,
            employeeId: u.id,
            managerName: users.find(m => m.id === u.reportingTo)?.name || "N/A",
            ruleTriggered: "Q1 Check-in Progress Capture Overdue (Aug 10 Deadline)",
            severity: "HIGH",
            timestamp: today.toISOString(),
            status: "Warning Email Sent to Employee & L1"
          });
        }
      }
    });
  }

  // Escalation rule 4: Q2 Check-in Capture Overdue. Due by November 10
  if (month === 10 && day >= 10) { // Nov 10 onwards
    users.forEach(u => {
      if (u.role === "Employee") {
        const userGoals = goals.filter(g => g.userId === u.id);
        const q2Empty = userGoals.some(g => !g.actualQ2);
        if (q2Empty) {
          escalations.push({
            id: `ESC_4_Q2_${u.id}`,
            employeeName: u.name,
            employeeId: u.id,
            managerName: users.find(m => m.id === u.reportingTo)?.name || "N/A",
            ruleTriggered: "Q2 Check-in Progress Capture Overdue (Nov 10 Deadline)",
            severity: "HIGH",
            timestamp: today.toISOString(),
            status: "Warning Email Sent to Employee & L1"
          });
        }
      }
    });
  }

  // Save escalations in localStorage
  setStorageItem(STORAGE_KEYS.ESCALATIONS, escalations);

  // Trigger Notifications for escalations
  escalations.forEach(esc => {
    // Check if we already logged notification for this escalation
    const logs = getNotifications();
    const notificationExists = logs.some(l => l.title.includes(esc.ruleTriggered) && l.title.includes(esc.employeeName));
    if (!notificationExists) {
      const emailTitle = `🚨 [ESCALATION] Overdue Action: ${esc.ruleTriggered} for ${esc.employeeName}`;
      const emailContent = `
        <h3>System Escalation Warning</h3>
        <p>This is a rule-triggered notification from the Atomberg Governance Core.</p>
        <p><strong>Employee</strong>: ${esc.employeeName} (ID: ${esc.employeeId})</p>
        <p><strong>Direct Manager</strong>: ${esc.managerName}</p>
        <p><strong>Escalation Rule</strong>: ${esc.ruleTriggered}</p>
        <p><strong>Severity</strong>: ${esc.severity}</p>
        <p><strong>Current Status</strong>: ${esc.status}</p>
        <hr/>
        <p>Please resolve this completion discrepancy immediately in the Atomberg Goal portal.</p>
      `;
      logNotification("EMAIL", "admin@atomberg.com", emailTitle, emailContent);
    }
  });
};

// 10. Login Credentials Verification
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error("No account found with this corporate email.");
  }
  
  const userPassword = user.password || "password123";
  if (userPassword !== password) {
    throw new Error("Invalid password credentials. Please try again.");
  }
  
  return user;
};

// 11. New Corporate Registration Engine
export const registerUser = (name, email, password, role, title, department, reportingTo, avatar) => {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error("An account is already registered with this corporate email.");
  }
  
  const id = `U_${Date.now()}`;
  const newUser = {
    id,
    name,
    email: email.toLowerCase(),
    password,
    role,
    title,
    department,
    reportingTo: reportingTo || "Board of Directors",
    avatar: avatar || (role === "Employee" ? "👩‍💻" : "👨‍💼")
  };
  
  users.push(newUser);
  setStorageItem(STORAGE_KEYS.USERS, users);
  
  // Seed a blank goal sheet if role is Employee
  if (role === "Employee") {
    const sheets = getSheets();
    sheets.push({
      id: `S_${id}`,
      userId: id,
      year: "2026-27",
      status: "DRAFT",
      submittedAt: null,
      approvedAt: null,
      comment: ""
    });
    setStorageItem(STORAGE_KEYS.SHEETS, sheets);
  }
  
  logAudit(id, name, "REGISTRATION", `Newly registered as corporate ${role} in ${department}.`);
  return newUser;
};

