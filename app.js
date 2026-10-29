/* Smart Amazing School Pulse
 * Frontend demo only. Data is stored in this browser's localStorage.
 * Real authentication, secure role permissions, a shared database, payment processing,
 * and complaint email delivery require a backend service before production use.
 */
const STORAGE_KEY = "smartAmazingSchoolPulseDemo_v1";
const initialData = {
  students: [
    { id: 1, name: "Amara Okafor", studentId: "SAP-001", className: "JSS 2", parent: "Mrs. Okafor", status: "Active" },
    { id: 2, name: "Daniel Musa", studentId: "SAP-002", className: "SS 1", parent: "Mr. Musa", status: "Active" },
    { id: 3, name: "Zara Bello", studentId: "SAP-003", className: "Primary 5", parent: "Mrs. Bello", status: "Active" }
  ],
  teachers: [
    { id: 1, name: "Mrs. Ada Nwosu", email: "ada@example.com", subjects: "Mathematics, Basic Science", status: "Active" },
    { id: 2, name: "Mr. Tunde James", email: "tunde@example.com", subjects: "English, Literature", status: "Active" }
  ],
  parents: [
    { id: 1, name: "Mrs. Okafor", email: "okafor@example.com", studentId: "SAP-001", verified: true },
    { id: 2, name: "Mr. Musa", email: "musa@example.com", studentId: "SAP-002", verified: true }
  ],
  subjects: ["Mathematics", "English Language", "Basic Science", "Social Studies"],
  invoices: [
    { id: 1, studentId: "SAP-001", student: "Amara Okafor", category: "School Fees", amount: 85000, paid: 60000, status: "Pending" },
    { id: 2, studentId: "SAP-002", student: "Daniel Musa", category: "School Fees", amount: 90000, paid: 90000, status: "Paid" },
    { id: 3, studentId: "SAP-003", student: "Zara Bello", category: "Examination Fees", amount: 15000, paid: 0, status: "Pending" }
  ],
  payments: [
    { id: 1, studentId: "SAP-001", student: "Amara Okafor", category: "School Fees", amount: 60000, method: "Bank transfer", date: "2026-10-10", reference: "DEMO-1001" },
    { id: 2, studentId: "SAP-002", student: "Daniel Musa", category: "School Fees", amount: 90000, method: "Demo payment", date: "2026-10-12", reference: "DEMO-1002" }
  ],
  scores: [
    { id: 1, studentId: "SAP-001", subject: "Mathematics", term: "First Term", ca1: 8, ca2: 7, exam: 65, max1: 10, max2: 10, maxExam: 80 },
    { id: 2, studentId: "SAP-001", subject: "English Language", term: "First Term", ca1: 9, ca2: 8, exam: 60, max1: 10, max2: 10, maxExam: 80 },
    { id: 3, studentId: "SAP-002", subject: "Mathematics", term: "First Term", ca1: 7, ca2: 8, exam: 58, max1: 10, max2: 10, maxExam: 80 }
  ],
  activities: [
    { id: 1, text: "Demo payment recorded for Daniel Musa", time: "Today • 10:30 AM", icon: "₦" },
    { id: 2, text: "Mathematics scores entered for JSS 2", time: "Today • 9:45 AM", icon: "✓" },
    { id: 3, text: "New parent account awaits school verification", time: "Yesterday • 3:20 PM", icon: "＋" }
  ]
};
let data = loadData();
let currentRole = "founder";
let currentPage = "overview";
let toastTimer;

const roles = {
  founder: { label: "Founder", name: "School Founder", nav: [
    ["overview","Overview","▦"],["activities","All activities","◷"],["students","Students","♙"],["teachers","Teachers","♧"],["parents","Parents","♧"],["subjects","Subjects","▤"],["fees","Fees & payments","₦"],["results","Academic results","✓"]
  ]},
  admin: { label: "Admin", name: "School Admin", nav: [
    ["overview","Overview","▦"],["students","Students","♙"],["teachers","Teachers","♧"],["parents","Parents","♧"],["subjects","Subjects","▤"],["fees","Fees & payments","₦"],["results","CA & examinations","✓"]
  ]},
  teacher: { label: "Teacher", name: "Teacher account", nav: [
    ["overview","Overview","▦"],["results","Enter scores","✓"],["students","My students","♙"],["subjects","Subjects","▤"]
  ]},
  parent: { label: "Parent", name: "Parent account", nav: [
    ["overview","My dashboard","▦"],["fees","Fees & payments","₦"],["results","My child's results","✓"],["complaint","Send a complaint","✉"]
  ]}
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return structuredClone(initialData);
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function money(n) { return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(Number(n) || 0); }
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function initials(name) { return String(name || "?").split(/\s+/).slice(0,2).map(s => s[0] || "").join("").toUpperCase(); }
function addActivity(text, icon="•") {
  data.activities.unshift({ id: Date.now(), text, icon, time: new Date().toLocaleString() });
  data.activities = data.activities.slice(0, 30);
  saveData();
}
function notify(message) {
  const el = document.getElementById("toast");
  el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}
function setRole(role) {
  currentRole = role;
  currentPage = "overview";
  document.getElementById("userName").textContent = roles[role].name;
  document.getElementById("userRole").textContent = roles[role].label + " preview";
  document.getElementById("userAvatar").textContent = initials(roles[role].name);
  renderNav(); renderPage();
}
function renderNav() {
  const nav = document.getElementById("navigation");
  nav.innerHTML = roles[currentRole].nav.map(([id,label,icon]) =>
    `<button class="nav-item ${currentPage===id?"active":""}" data-page="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`
  ).join("");
  nav.querySelectorAll("[data-page]").forEach(b => b.addEventListener("click", () => {
    currentPage = b.dataset.page; document.getElementById("sidebar").classList.remove("open"); renderNav(); renderPage();
  }));
}
function pageHeading(title, subtitle, action="") {
  return `<div class="page-heading"><div><p class="eyebrow">${escapeHTML(roles[currentRole].label)} portal</p><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${action}</div>`;
}
function stat(label,value,icon,note="") {
  return `<div class="card stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`;
}
function badge(status) {
  const cls = String(status).toLowerCase().replace(/\s+/g,"-");
  return `<span class="badge ${escapeHTML(cls)}">${escapeHTML(status)}</span>`;
}
function activityList(limit=6) {
  return `<div class="activity-list">${data.activities.slice(0,limit).map(a=>`<div class="activity"><div class="activity-icon">${escapeHTML(a.icon)}</div><div><p>${escapeHTML(a.text)}</p><small>${escapeHTML(a.time)}</small></div></div>`).join("") || `<div class="empty">No activity recorded yet.</div>`}</div>`;
}
function overviewPage() {
  if (currentRole === "parent") {
    const parent = data.parents.find(p=>p.studentId==="SAP-001") || data.parents[0];
    const student = data.students.find(s=>s.studentId===parent?.studentId);
    const invoices = data.invoices.filter(i=>i.studentId===student?.studentId);
    const total = invoices.reduce((s,i)=>s+i.amount,0), paid = invoices.reduce((s,i)=>s+i.paid,0);
    return pageHeading("Welcome to your parent portal","A clear view of your child's school fees and academic progress.")+
      `<div class="notice" style="margin-bottom:18px">Demo account is linked to <strong>${escapeHTML(student?.name || "No linked student")}</strong> (${escapeHTML(student?.className || "Class pending")}). In production, the school must verify and link the child to the parent's account.</div>
      <div class="grid stats-grid">${stat("Total fees charged",money(total),"₦","For linked child")}${stat("Amount paid",money(paid),"✓","Recorded payments")}${stat("Outstanding balance",money(Math.max(0,total-paid)),"◷","Remaining fees")}${stat("Subjects with scores",data.scores.filter(s=>s.studentId===student?.studentId).length,"▤","Available score records")}</div>
      <div class="grid two-col"><section class="card"><div class="section-head"><div><h2>Recent payments</h2><p>Payments recorded for your child</p></div><button class="button small" data-goto="fees">View fees</button></div>${paymentsTable(data.payments.filter(p=>p.studentId===student?.studentId))}</section><section class="card"><div class="section-head"><div><h2>Academic progress</h2><p>Latest subject results</p></div><button class="button small" data-goto="results">View results</button></div>${scoreCards(data.scores.filter(s=>s.studentId===student?.studentId))}</section></div>`;
  }
  const collected = data.invoices.reduce((s,i)=>s+i.paid,0);
  const outstanding = data.invoices.reduce((s,i)=>s+Math.max(0,i.amount-i.paid),0);
  const isFounder = currentRole === "founder";
  const isTeacher = currentRole === "teacher";
  const title = isFounder ? "School overview" : isTeacher ? "Teaching overview" : "Administration overview";
  const subtitle = isFounder ? "Monitor the school's key figures and activity across departments." : isTeacher ? "Review student records and keep academic scores up to date." : "Manage day-to-day school operations from one place.";
  const stats = isTeacher
    ? stat("Students",data.students.length,"♙","Demo school records")+stat("Subjects",data.subjects.length,"▤","Available subjects")+stat("Score entries",data.scores.length,"✓","Recorded assessments")+stat("Classes",new Set(data.students.map(s=>s.className)).size,"▦","Classes represented")
    : stat("Students",data.students.length,"♙","Current student records")+stat("Teachers",data.teachers.length,"♧","Teaching staff")+stat("Fees collected",money(collected),"₦","Recorded against invoices")+stat("Outstanding fees",money(outstanding),"◷","Awaiting payment");
  return pageHeading(title,subtitle, isFounder?`<button class="button primary" data-goto="activities">Review all activities</button>`:"")+
    `<div class="grid stats-grid">${stats}</div>
    <div class="grid two-col"><section class="card"><div class="section-head"><div><h2>${isFounder?"School activity log":"Recent school activity"}</h2><p>${isFounder?"Latest recorded actions across the system":"Recent updates in the demo portal"}</p></div>${isFounder?`<button class="button small" data-goto="activities">See all</button>`:""}</div>${activityList(5)}</section>
    <section class="card"><div class="section-head"><div><h2>Quick actions</h2><p>Go directly to a section</p></div></div><div class="quick-grid">${quick("♙","Student records","Manage student information","students")}${quick("▤","Subjects","View subject list","subjects")}${quick("✓","CA & results","Review academic scores","results")}${quick("₦","Fees & payments","Review fee records","fees")}</div></section></div>`;
}
function quick(icon,title,desc,page) { return `<button class="quick-action" data-goto="${page}"><span>${icon}</span><strong>${title}</strong><small>${desc}</small></button>`; }

function studentsPage() {
  const canManage = ["founder","admin"].includes(currentRole);
  const rows = data.students.map(s=>`<tr><td><div class="person"><div class="person-avatar">${initials(s.name)}</div><div><span>${escapeHTML(s.name)}</span><small>${escapeHTML(s.studentId)}</small></div></div></td><td>${escapeHTML(s.className)}</td><td>${escapeHTML(s.parent)}</td><td>${badge(s.status)}</td>${canManage?`<td><button class="button small danger" data-delete="student" data-id="${s.id}">Delete</button></td>`:""}</tr>`).join("");
  return pageHeading(currentRole==="parent"?"Linked student":"Students","Student records and parent links.",canManage?`<button class="button primary" data-goto="addStudent">＋ Add student</button>`:"")+
  `<section class="card"><div class="section-head"><div><h2>Student directory</h2><p>${data.students.length} student records</p></div></div><div class="table-wrap"><table><thead><tr><th>Student</th><th>Class</th><th>Parent / guardian</th><th>Status</th>${canManage?"<th>Action</th>":""}</tr></thead><tbody>${rows||`<tr><td colspan="5" class="empty">No students found.</td></tr>`}</tbody></table></div></section>`;
}
function teachersPage() {
  const canManage = ["founder","admin"].includes(currentRole);
  return pageHeading("Teachers","Teaching staff and assigned subjects.",canManage?`<button class="button primary" data-goto="addTeacher">＋ Add teacher</button>`:"")+
  `<section class="card"><div class="table-wrap"><table><thead><tr><th>Teacher</th><th>Email</th><th>Subjects</th><th>Status</th>${canManage?"<th>Action</th>":""}</tr></thead><tbody>${data.teachers.map(t=>`<tr><td><div class="person"><div class="person-avatar">${initials(t.name)}</div><span>${escapeHTML(t.name)}</span></div></td><td>${escapeHTML(t.email)}</td><td>${escapeHTML(t.subjects)}</td><td>${badge(t.status)}</td>${canManage?`<td><button class="button small danger" data-delete="teacher" data-id="${t.id}">Delete</button></td>`:""}</tr>`).join("")}</tbody></table></div></section>`;
}
function parentsPage() {
  const canManage = ["founder","admin"].includes(currentRole);
  return pageHeading("Parents & guardians","Parent accounts and school verification.",canManage?`<button class="button primary" data-goto="addParent">＋ Add parent</button>`:"")+
  `<div class="notice" style="margin-bottom:16px">Parent self-registration and identity verification require a secure backend. This demo displays sample parent records only.</div><section class="card"><div class="table-wrap"><table><thead><tr><th>Parent / guardian</th><th>Email</th><th>Student ID</th><th>Verification</th>${canManage?"<th>Action</th>":""}</tr></thead><tbody>${data.parents.map(p=>`<tr><td>${escapeHTML(p.name)}</td><td>${escapeHTML(p.email)}</td><td>${escapeHTML(p.studentId)}</td><td>${badge(p.verified?"Active":"Pending")}</td>${canManage?`<td>${p.verified?`<button class="button small" data-verify="${p.id}">Unverify</button>`:`<button class="button small primary" data-verify="${p.id}">Verify & link</button>`} <button class="button small danger" data-delete="parent" data-id="${p.id}">Delete</button></td>`:""}</tr>`).join("")}</tbody></table></div></section>`;
}
function subjectsPage() {
  const canManage = ["founder","admin"].includes(currentRole);
  return pageHeading("Subjects","Manage subjects available for classes and assessments.",canManage?`<button class="button primary" data-goto="addSubject">＋ Add subject</button>`:"")+
  `<section class="card"><div class="grid three-col">${data.subjects.map(s=>`<div class="subject-card"><div class="stat-icon">▤</div><h3 style="margin-top:13px">${escapeHTML(s)}</h3><p class="muted">Subject in school curriculum</p>${canManage?`<button class="button small danger" data-delete-subject="${escapeHTML(s)}">Delete subject</button>`:""}</div>`).join("")}</div></section>`;
}
function feesPage() {
  let invoices = data.invoices;
  if (currentRole === "parent") invoices = invoices.filter(i=>i.studentId==="SAP-001");
  const rows = invoices.map(i=>`<tr><td>${escapeHTML(i.student)}</td><td>${escapeHTML(i.category)}</td><td>${money(i.amount)}</td><td>${money(i.paid)}</td><td><strong>${money(Math.max(0,i.amount-i.paid))}</strong></td><td>${badge(i.amount<=i.paid?"Paid":"Pending")}</td></tr>`).join("");
  const total = invoices.reduce((s,i)=>s+i.amount,0), paid = invoices.reduce((s,i)=>s+i.paid,0);
  return pageHeading(currentRole==="parent"?"Fees & payments":"School fees & payments","Track invoices, recorded payments and outstanding balances.",["founder","admin"].includes(currentRole)?`<button class="button primary" data-goto="addInvoice">＋ Create invoice</button>`:"")+
  `<div class="grid stats-grid">${stat("Total billed",money(total),"₦","Invoices in view")}${stat("Paid",money(paid),"✓","Recorded payments")}${stat("Outstanding",money(Math.max(0,total-paid)),"◷","Remaining balance")}${stat("Invoices",invoices.length,"▤","Invoice records")}</div>
  <section class="card"><div class="section-head"><div><h2>${currentRole==="parent"?"Your child's fee breakdown":"Invoice register"}</h2><p>Demo data only; no actual payments are processed.</p></div></div><div class="table-wrap"><table><thead><tr><th>Student</th><th>Category</th><th>Amount due</th><th>Amount paid</th><th>Outstanding</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div></section>
  ${currentRole==="parent"?`<section class="card" style="margin-top:16px"><h2>Payment history</h2>${paymentsTable(data.payments.filter(p=>p.studentId==="SAP-001"))}</section>`:""}`;
}
function paymentsTable(payments) {
  if (!payments.length) return `<div class="empty">No payment records.</div>`;
  return `<div class="table-wrap"><table><thead><tr><th>Reference</th><th>Category</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead><tbody>${payments.map(p=>`<tr><td>${escapeHTML(p.reference)}</td><td>${escapeHTML(p.category)}</td><td>${money(p.amount)}</td><td>${escapeHTML(p.method)}</td><td>${escapeHTML(p.date)}</td></tr>`).join("")}</tbody></table></div>`;
}
function scoreTotal(s) { return Number(s.ca1)+Number(s.ca2)+Number(s.exam); }
function gradeFor(total, max) { const pct=max?total/max*100:0; return pct>=70?"A":pct>=60?"B":pct>=50?"C":pct>=45?"D":pct>=40?"E":"F"; }
function scoreCards(scores) {
  if (!scores.length) return `<div class="empty">No scores recorded yet.</div>`;
  return `<div class="grid">${scores.map(s=>{const total=scoreTotal(s), max=Number(s.max1)+Number(s.max2)+Number(s.maxExam);return `<div class="subject-card"><div class="section-head"><div><h3>${escapeHTML(s.subject)}</h3><p class="muted">${escapeHTML(s.term)}</p></div><strong>${total}/${max}</strong></div><div class="progress"><span style="width:${Math.min(100,max?total/max*100:0)}%"></span></div><p class="muted" style="font-size:11px;margin:0">1st CA: ${s.ca1}/${s.max1} · 2nd CA: ${s.ca2}/${s.max2} · Exam: ${s.exam}/${s.maxExam} · Grade ${gradeFor(total,max)}</p></div>`}).join("")}</div>`;
}
function resultsPage() {
  const canEdit = ["founder","admin","teacher"].includes(currentRole);
  let scores = data.scores;
  if (currentRole === "parent") scores = scores.filter(s=>s.studentId==="SAP-001");
  const rows = scores.map(s=>`<tr><td>${escapeHTML(data.students.find(st=>st.studentId===s.studentId)?.name||s.studentId)}</td><td>${escapeHTML(s.subject)}</td><td>${escapeHTML(s.term)}</td><td>${s.ca1}/${s.max1}</td><td>${s.ca2}/${s.max2}</td><td>${s.exam}/${s.maxExam}</td><td><strong>${scoreTotal(s)}/${Number(s.max1)+Number(s.max2)+Number(s.maxExam)}</strong></td><td>${gradeFor(scoreTotal(s),Number(s.max1)+Number(s.max2)+Number(s.maxExam))}</td>${canEdit?`<td><button class="button small" data-edit-score="${s.id}">Edit</button> <button class="button small danger" data-delete="score" data-id="${s.id}">Delete</button></td>`:""}</tr>`).join("");
  return pageHeading(currentRole==="parent"?"Academic results":"CA & examination results","Each subject has 1st CA, 2nd CA and an examination score.",canEdit?`<button class="button primary" data-goto="addScore">＋ Enter scores</button>`:"")+
  `<div class="notice" style="margin-bottom:16px">Default format: 1st CA /10 + 2nd CA /10 + examination /80 = 100 marks. Maximum marks can be changed when entering a score. Grades use demo thresholds and should be aligned with the school's official grading policy.</div>
  <section class="card"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Subject</th><th>Term</th><th>1st CA</th><th>2nd CA</th><th>Exam</th><th>Total</th><th>Grade</th>${canEdit?"<th>Actions</th>":""}</tr></thead><tbody>${rows||`<tr><td colspan="9" class="empty">No results available.</td></tr>`}</tbody></table></div></section>`;
}
function activitiesPage() {
  if (currentRole !== "founder") return overviewPage();
  return pageHeading("All activities","Audit-style list of actions recorded in this browser demo.")+
    `<section class="card"><div class="section-head"><div><h2>Activity log</h2><p>Newest events appear first.</p></div><button class="button small" data-clear-activity>Clear log</button></div>${activityList(30)}</section>`;
}
function complaintPage() {
  return pageHeading("Send a complaint","Your message should go directly to the school's official email address.")+
    `<div class="grid two-col"><section class="card"><h2>Complaint form</h2><p class="subtitle" style="margin-bottom:18px">Please provide enough detail for the school to understand and respond.</p>
    <form id="complaintForm" class="form-grid">
      <div class="field"><label for="complaintName">Parent / guardian name</label><input id="complaintName" name="name" required placeholder="Your full name"></div>
      <div class="field"><label for="complaintEmail">Your email</label><input id="complaintEmail" name="email" type="email" required placeholder="you@example.com"></div>
      <div class="field full"><label for="complaintStudent">Child's name / student ID</label><input id="complaintStudent" name="student" required placeholder="Student name or ID"></div>
      <div class="field full"><label for="complaintSubject">Subject</label><input id="complaintSubject" name="subject" required placeholder="e.g. Fee payment clarification"></div>
      <div class="field full"><label for="complaintMessage">Complaint details</label><textarea id="complaintMessage" name="message" required placeholder="Explain your concern clearly..."></textarea></div>
      <div class="field full"><button class="button primary" type="submit">Prepare email complaint</button><p class="form-hint">Email delivery is not connected in this frontend demo. A secure backend email service and the school's recipient email must be configured before this form can send automatically.</p></div>
    </form></section>
    <section class="card"><div class="stat-icon">✉</div><h2 style="margin-top:15px">Direct email delivery</h2><p class="subtitle">In the production version, submitting this form will send the complaint directly to the school email address. The complaint will not need to appear in a website inbox.</p><div class="notice" style="margin-top:16px">Never place SMTP passwords, private API keys or email service secrets in this JavaScript file. They must be stored in server-side environment variables.</div></section></div>`;
}
function formPage(kind) {
  const config = {
    addStudent:{title:"Add student",desc:"Create a student record.",fields:[["name","Student full name","text",true],["studentId","Student ID","text",true],["className","Class","text",true],["parent","Parent / guardian name","text",true]]},
    addTeacher:{title:"Add teacher",desc:"Create a teacher record.",fields:[["name","Teacher full name","text",true],["email","Email address","email",true],["subjects","Subjects taught (comma-separated)","text",true]]},
    addParent:{title:"Add parent",desc:"Add a parent and link a student. Verify the parent identity before using real records.",fields:[["name","Parent / guardian name","text",true],["email","Email address","email",true],["studentId","Student ID to link","text",true]]},
    addSubject:{title:"Add subject",desc:"Add a subject to the school curriculum.",fields:[["name","Subject name","text",true]]},
    addInvoice:{title:"Create fee invoice",desc:"Create a demo fee invoice for a student.",fields:[["studentId","Student ID","text",true],["category","Fee category","select",true,["School Fees","Examination Fees","Registration Fees","Uniform Fees","Other Charges"]],["amount","Amount in naira","number",true]]},
    addScore:{title:"Enter CA & examination scores",desc:"Enter a score record. The default maximums are 10 + 10 + 80.",fields:[["studentId","Student ID","select",true,data.students.map(s=>({value:s.studentId,label:`${s.name} (${s.studentId})`}))],["subject","Subject","select",true,data.subjects.map(s=>({value:s,label:s}))],["term","Term","select",true,["First Term","Second Term","Third Term"]],["ca1","1st CA score","number",true],["max1","1st CA maximum","number",true],["ca2","2nd CA score","number",true],["max2","2nd CA maximum","number",true],["exam","Examination score","number",true],["maxExam","Examination maximum","number",true]]}
  }[kind];
  if (!config) return "";
  const fields = config.fields.map(([name,label,type,required,options])=>{
    let input = "";
    if (type==="select") {
      const opts = options.map(o=>typeof o==="string"?{value:o,label:o}:o);
      input = `<select name="${name}" id="${name}" ${required?"required":""}>${opts.map(o=>`<option value="${escapeHTML(o.value)}">${escapeHTML(o.label)}</option>`).join("")}</select>`;
    } else input = `<input name="${name}" id="${name}" type="${type}" ${required?"required":""} ${type==="number"?'min="0" step="any"':""} ${name==="max1"?'value="10"':name==="max2"?'value="10"':name==="maxExam"?'value="80"':""}>`;
    return `<div class="field"><label for="${name}">${label}</label>${input}</div>`;
  }).join("");
  return pageHeading(config.title,config.desc,`<button class="button" data-goto="${kind==="addStudent"?"students":kind==="addTeacher"?"teachers":kind==="addParent"?"parents":kind==="addSubject"?"subjects":kind==="addInvoice"?"fees":"results"}">← Back</button>`) +
  `<section class="card"><form id="recordForm" data-kind="${kind}"><div class="form-grid">${fields}</div><div class="form-actions"><button class="button primary" type="submit">Save record</button><button class="button" type="button" data-goto="${kind==="addStudent"?"students":kind==="addTeacher"?"teachers":kind==="addParent"?"parents":kind==="addSubject"?"subjects":kind==="addInvoice"?"fees":"results"}">Cancel</button></div></form></section>`;
}
function renderPage() {
  const pages = {
    overview: overviewPage, students: studentsPage, teachers: teachersPage, parents: parentsPage,
    subjects: subjectsPage, fees: feesPage, results: resultsPage, activities: activitiesPage,
    complaint: complaintPage
  };
  const page = pages[currentPage] ? pages[currentPage]() : formPage(currentPage);
  document.getElementById("page").innerHTML = page || `<div class="empty">Page not found.</div>`;
  document.getElementById("pageCrumb").textContent = ({
    overview:"Overview",students:"Students",teachers:"Teachers",parents:"Parents",subjects:"Subjects",fees:"Fees & payments",results:"Academic results",activities:"All activities",complaint:"Send a complaint",
    addStudent:"Add student",addTeacher:"Add teacher",addParent:"Add parent",addSubject:"Add subject",addInvoice:"Create invoice",addScore:"Enter scores"
  })[currentPage] || "School portal";
  attachPageEvents();
}
function attachPageEvents() {
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>{currentPage=b.dataset.goto;renderNav();renderPage();}));
  document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{
    if (!["founder","admin"].includes(currentRole)) return notify("You do not have permission to delete records.");
    const type=b.dataset.delete, id=Number(b.dataset.id);
    if (!confirm("Delete this record from the local demo?")) return;
    const key={student:"students",teacher:"teachers",parent:"parents",score:"scores"}[type];
    data[key]=data[key].filter(item=>item.id!==id); addActivity(`${type} record #${id} deleted`, "−"); renderPage(); notify("Record deleted in this browser demo.");
  }));
  document.querySelectorAll("[data-delete-subject]").forEach(b=>b.addEventListener("click",()=>{
    if (!["founder","admin"].includes(currentRole)) return;
    const subject=b.dataset.deleteSubject;
    if (!confirm(`Delete subject "${subject}"?`)) return;
    data.subjects=data.subjects.filter(s=>s!==subject); addActivity(`Subject "${subject}" deleted`,"−"); renderPage(); notify("Subject deleted.");
  }));
  document.querySelectorAll("[data-verify]").forEach(b=>b.addEventListener("click",()=>{
    if (!["founder","admin"].includes(currentRole)) return;
    const p=data.parents.find(x=>x.id===Number(b.dataset.verify)); if(!p)return;
    p.verified=!p.verified; addActivity(`Parent ${p.name} ${p.verified?"verified and linked":"verification removed"}`,"✓"); saveData(); renderPage(); notify("Parent verification updated.");
  }));
  document.querySelectorAll("[data-edit-score]").forEach(b=>b.addEventListener("click",()=>{
    const s=data.scores.find(x=>x.id===Number(b.dataset.editScore)); if(!s)return;
    currentPage="addScore"; renderNav(); renderPage();
    const form=document.getElementById("recordForm"); if(!form)return;
    form.dataset.editId=s.id;
    Object.entries(s).forEach(([key,value])=>{const field=form.elements.namedItem(key);if(field)field.value=value;});
    const submit=form.querySelector('button[type="submit"]'); if(submit)submit.textContent="Update scores";
  }));
  document.querySelector("[data-clear-activity]")?.addEventListener("click",()=>{
    if(currentRole!=="founder")return; if(!confirm("Clear the demo activity log?"))return;
    data.activities=[];saveData();renderPage();notify("Activity log cleared.");
  });
  document.getElementById("recordForm")?.addEventListener("submit", handleRecordSubmit);
  document.getElementById("complaintForm")?.addEventListener("submit", handleComplaint);
}
function handleRecordSubmit(event) {
  event.preventDefault();
  if (!["founder","admin","teacher"].includes(currentRole)) return notify("You do not have permission to add records.");
  const form=event.currentTarget, kind=form.dataset.kind, fd=new FormData(form), v=Object.fromEntries(fd.entries());
  const num = key => Number(v[key] || 0);
  if (kind==="addStudent") {
    if(data.students.some(s=>s.studentId===v.studentId)) return notify("That student ID already exists.");
    data.students.push({id:Date.now(),name:v.name.trim(),studentId:v.studentId.trim(),className:v.className.trim(),parent:v.parent.trim(),status:"Active"});
    addActivity(`Student ${v.name} added`,"＋"); currentPage="students";
  } else if(kind==="addTeacher") {
    data.teachers.push({id:Date.now(),name:v.name.trim(),email:v.email.trim(),subjects:v.subjects.trim(),status:"Active"});
    addActivity(`Teacher ${v.name} added`,"＋"); currentPage="teachers";
  } else if(kind==="addParent") {
    if(!data.students.some(s=>s.studentId===v.studentId)) return notify("Student ID not found. Add the student first.");
    data.parents.push({id:Date.now(),name:v.name.trim(),email:v.email.trim(),studentId:v.studentId.trim(),verified:false});
    addActivity(`Parent account for ${v.name} added; verification pending`,"＋"); currentPage="parents";
  } else if(kind==="addSubject") {
    if(data.subjects.some(s=>s.toLowerCase()===v.name.trim().toLowerCase()))return notify("That subject already exists.");
    data.subjects.push(v.name.trim()); addActivity(`Subject ${v.name} added`,"＋"); currentPage="subjects";
  } else if(kind==="addInvoice") {
    const student=data.students.find(s=>s.studentId===v.studentId); if(!student)return notify("Student ID not found.");
    data.invoices.push({id:Date.now(),studentId:student.studentId,student:student.name,category:v.category,amount:num("amount"),paid:0,status:"Pending"});
    addActivity(`Invoice created for ${student.name}: ${money(num("amount"))}`,"₦"); currentPage="fees";
  } else if(kind==="addScore") {
    const max1=num("max1"), max2=num("max2"), maxExam=num("maxExam");
    if(num("ca1")>max1||num("ca2")>max2||num("exam")>maxExam)return notify("A score cannot exceed its maximum mark.");
    const record={studentId:v.studentId,subject:v.subject,term:v.term,ca1:num("ca1"),max1,ca2:num("ca2"),max2,exam:num("exam"),maxExam};
    if(form.dataset.editId) {
      const index=data.scores.findIndex(s=>s.id===Number(form.dataset.editId)); if(index>=0)data.scores[index]={...data.scores[index],...record};
      addActivity(`Scores updated for ${record.subject} (${record.studentId})`,"✓");
    } else {
      data.scores.push({id:Date.now(),...record}); addActivity(`Scores entered for ${record.subject} (${record.studentId})`,"✓");
    }
    currentPage="results";
  }
  saveData(); renderNav(); renderPage(); notify("Saved in this browser demo.");
}
function handleComplaint(event) {
  event.preventDefault();
  const fd=new FormData(event.currentTarget);
  const name=fd.get("name"), email=fd.get("email"), student=fd.get("student"), subject=fd.get("subject"), message=fd.get("message");
  // Fallback opens the user's email app. Automatic sending requires a backend email provider.
  const recipient = ""; // Add school recipient only after configuring a secure backend.
  const body=`Parent: ${name}\nReply email: ${email}\nStudent: ${student}\n\n${message}`;
  if(!recipient) {
    const mailto=`mailto:?subject=${encodeURIComponent("[School Complaint] "+subject)}&body=${encodeURIComponent(body)}`;
    window.location.href=mailto;
    notify("Your email app should open. The school's recipient email has not been configured yet.");
  } else {
    window.location.href=`mailto:${recipient}?subject=${encodeURIComponent("[School Complaint] "+subject)}&body=${encodeURIComponent(body)}`;
  }
}
document.getElementById("roleSelect").addEventListener("change",e=>setRole(e.target.value));
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("resetDemo").addEventListener("click",()=>{
  if(!confirm("Reset all demo data in this browser?"))return;
  data=structuredClone(initialData);saveData();currentPage="overview";renderNav();renderPage();notify("Demo data reset.");
});
setRole("founder");
