import fs from "fs";
import path from "path";

const firmId = "firm_01";
const firms = [
  {
    id: firmId,
    name: "Vaigai Vel & Associates",
  },
];

const people = [
  // 2 Partners
  {
    id: "p_partner_1",
    firm_id: firmId,
    name: "Kavitha Vel (Partner)",
    email: "kavitha@vaigaivel.com",
    password: "Partner123!",
    role: "partner",
    client_id: null,
    created_at: "2026-11-01T09:00:00Z",
  },
  {
    id: "p_partner_2",
    firm_id: firmId,
    name: "Sundar Vel (Partner)",
    email: "sundar@vaigaivel.com",
    password: "Partner123!",
    role: "partner",
    client_id: null,
    created_at: "2026-11-01T09:00:00Z",
  },
  // 6 Staff (including 1 trainee)
  {
    id: "p_staff_1",
    firm_id: firmId,
    name: "Priya Raman (Senior Staff)",
    email: "priya@vaigaivel.com",
    password: "Staff123!",
    role: "staff",
    client_id: null,
    created_at: "2026-11-02T09:00:00Z",
  },
  {
    id: "p_staff_2",
    firm_id: firmId,
    name: "Karthik Subramanian (Staff)",
    email: "karthik@vaigaivel.com",
    password: "Staff123!",
    role: "staff",
    client_id: null,
    created_at: "2026-11-02T09:00:00Z",
  },
  {
    id: "p_staff_3",
    firm_id: firmId,
    name: "Meera Natarajan (Staff)",
    email: "meera@vaigaivel.com",
    password: "Staff123!",
    role: "staff",
    client_id: null,
    created_at: "2026-11-02T09:00:00Z",
  },
  {
    id: "p_staff_4",
    firm_id: firmId,
    name: "Suresh Kannan (Staff)",
    email: "suresh@vaigaivel.com",
    password: "Staff123!",
    role: "staff",
    client_id: null,
    created_at: "2026-11-02T09:00:00Z",
  },
  {
    id: "p_staff_5",
    firm_id: firmId,
    name: "Ananya Iyer (Staff)",
    email: "ananya@vaigaivel.com",
    password: "Staff123!",
    role: "staff",
    client_id: null,
    created_at: "2026-11-02T09:00:00Z",
  },
  {
    id: "p_staff_6",
    firm_id: firmId,
    name: "Dinesh Kumar (Trainee)",
    email: "dinesh@vaigaivel.com",
    password: "Staff123!",
    role: "staff",
    client_id: null,
    created_at: "2026-11-03T09:00:00Z",
  },
  // 10 Clients
  {
    id: "p_client_1",
    firm_id: firmId,
    name: "Rajesh (Madurai Spices)",
    email: "client1@maduraispices.com",
    password: "Client123!",
    role: "client",
    client_id: "c_1",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_2",
    firm_id: firmId,
    name: "Lakshmi (Meenakshi Silks)",
    email: "client2@meenakshi.com",
    password: "Client123!",
    role: "client",
    client_id: "c_2",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_3",
    firm_id: firmId,
    name: "Murugan (Vaigai Motors)",
    email: "client3@vaigaimotors.com",
    password: "Client123!",
    role: "client",
    client_id: "c_3",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_4",
    firm_id: firmId,
    name: "Gopal (Pandian Logistics)",
    email: "client4@pandian.com",
    password: "Client123!",
    role: "client",
    client_id: "c_4",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_5",
    firm_id: firmId,
    name: "Saravanan (Temple City Foods)",
    email: "client5@templecity.com",
    password: "Client123!",
    role: "client",
    client_id: "c_5",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_6",
    firm_id: firmId,
    name: "Kannan (Jasmine Textiles)",
    email: "client6@jasminetex.com",
    password: "Client123!",
    role: "client",
    client_id: "c_6",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_7",
    firm_id: firmId,
    name: "Ravi (Thirumalai Granite)",
    email: "client7@thirumalai.com",
    password: "Client123!",
    role: "client",
    client_id: "c_7",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_8",
    firm_id: firmId,
    name: "Bala (Alagar Agri Implements)",
    email: "client8@alagaragri.com",
    password: "Client123!",
    role: "client",
    client_id: "c_8",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_9",
    firm_id: firmId,
    name: "Senthil (Koodal Tech Solutions)",
    email: "client9@koodaltech.com",
    password: "Client123!",
    role: "client",
    client_id: "c_9",
    created_at: "2026-11-04T09:00:00Z",
  },
  {
    id: "p_client_10",
    firm_id: firmId,
    name: "Vijayan (Madura Mills & Trade)",
    email: "client10@maduramills.com",
    password: "Client123!",
    role: "client",
    client_id: "c_10",
    created_at: "2026-11-04T09:00:00Z",
  },
  // Auditor
  {
    id: "p_auditor_1",
    firm_id: firmId,
    name: "Raghavan (Statutory Auditor)",
    email: "auditor@raghavanca.com",
    password: "Auditor123!",
    role: "auditor",
    client_id: null,
    created_at: "2026-11-05T09:00:00Z",
  },
];

const clientNames = [
  { id: "c_1", name: "Madurai Spices & Co" },
  { id: "c_2", name: "Meenakshi Silks" },
  { id: "c_3", name: "Vaigai Motors" },
  { id: "c_4", name: "Pandian Logistics" },
  { id: "c_5", name: "Temple City Foods" },
  { id: "c_6", name: "Jasmine Textiles" },
  { id: "c_7", name: "Thirumalai Granite" },
  { id: "c_8", name: "Alagar Agri Implements" },
  { id: "c_9", name: "Koodal Tech Solutions" },
  { id: "c_10", name: "Madura Mills & Trade" },
];

const clients = clientNames.map((c, idx) => ({
  id: c.id,
  firm_id: firmId,
  name: c.name,
  created_at: `2026-11-04T10:0${idx}:00Z`,
}));

const client_access = [
  { id: "ca_1", person_id: "p_staff_1", client_id: "c_1", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_2", person_id: "p_staff_1", client_id: "c_2", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_3", person_id: "p_staff_1", client_id: "c_3", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_4", person_id: "p_staff_2", client_id: "c_3", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_5", person_id: "p_staff_2", client_id: "c_4", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_6", person_id: "p_staff_2", client_id: "c_5", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_7", person_id: "p_staff_3", client_id: "c_5", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_8", person_id: "p_staff_3", client_id: "c_6", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_9", person_id: "p_staff_3", client_id: "c_7", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_10", person_id: "p_staff_4", client_id: "c_7", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_11", person_id: "p_staff_4", client_id: "c_8", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_12", person_id: "p_staff_5", client_id: "c_9", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_13", person_id: "p_staff_5", client_id: "c_10", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_14", person_id: "p_staff_6", client_id: "c_1", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_15", person_id: "p_staff_6", client_id: "c_2", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_16", person_id: "p_auditor_1", client_id: "c_1", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
  { id: "ca_17", person_id: "p_auditor_1", client_id: "c_2", given_by: "p_partner_1", created_at: "2026-11-04T11:00:00Z" },
];

const defaultItems = [
  "March 2026 Bank Statement",
  "Annual GST Summary (GSTR-9)",
  "TDS Certificate (Form 16A)",
  "Purchase Bills Q4",
  "Auditor Trial Balance",
];

const checklist_items = [];
let itemCounter = 1;
clients.forEach((c) => {
  defaultItems.forEach((name, idx) => {
    checklist_items.push({
      id: `chk_${itemCounter++}`,
      client_id: c.id,
      name,
      done: idx === 0 ? "yes" : "no",
    });
  });
});

const files = [
  {
    id: "f_1",
    client_id: "c_1",
    uploaded_by: "p_staff_1",
    uploader_name: "Priya Raman (Senior Staff)",
    name: "March_2026_Bank_Statement.pdf",
    storage_path: "docs/samples/March_2026_Bank_Statement.pdf",
    file_type: "application/pdf",
    file_size: 42100,
    checklist_item_id: "chk_1",
    created_at: "2026-11-05T14:30:00Z",
  },
  {
    id: "f_2",
    client_id: "c_2",
    uploaded_by: "p_staff_1",
    uploader_name: "Priya Raman (Senior Staff)",
    name: "Q4_GST_Filing_Summary.pdf",
    storage_path: "docs/samples/Q4_GST_Filing_Summary.pdf",
    file_type: "application/pdf",
    file_size: 38900,
    checklist_item_id: "chk_6",
    created_at: "2026-11-06T11:20:00Z",
  },
  {
    id: "f_3",
    client_id: "c_3",
    uploaded_by: "p_staff_2",
    uploader_name: "Karthik Subramanian (Staff)",
    name: "TDS_Certificate_16A.pdf",
    storage_path: "docs/samples/TDS_Certificate_16A.pdf",
    file_type: "application/pdf",
    file_size: 34500,
    checklist_item_id: "chk_13",
    created_at: "2026-11-07T16:45:00Z",
  },
];

const activity_log = [
  {
    id: "log_1",
    person_id: "p_staff_1",
    person_name: "Priya Raman",
    file_id: "f_1",
    file_name: "March_2026_Bank_Statement.pdf",
    action: "upload_file",
    blocked: "no",
    created_at: "2026-11-05T14:30:00Z",
  },
  {
    id: "log_2",
    person_id: "p_staff_1",
    person_name: "Priya Raman",
    file_id: "f_2",
    file_name: "Q4_GST_Filing_Summary.pdf",
    action: "upload_file",
    blocked: "no",
    created_at: "2026-11-06T11:20:00Z",
  },
];

const database = {
  firms,
  people,
  clients,
  client_access,
  files,
  checklist_items,
  download_links: [],
  activity_log,
};

const targetDir = path.join(process.cwd(), "data");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(
  path.join(targetDir, "clientlocker_db.json"),
  JSON.stringify(database, null, 2),
  "utf-8"
);

console.log("Database seeded successfully with:");
console.log(`- ${firms.length} firm`);
console.log(`- ${people.length} people (2 partners, 6 staff including 1 trainee, 10 clients, 1 auditor)`);
console.log(`- ${clients.length} clients`);
console.log(`- ${client_access.length} client access rules`);
console.log(`- ${checklist_items.length} checklist items (5 per client)`);
console.log(`- ${files.length} seeded files`);
