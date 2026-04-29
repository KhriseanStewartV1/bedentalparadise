export const DEMO_ADMIN_EMAIL = "demo@bedentalparadise.com";
export const DEMO_ADMIN_PASSWORD = "demo123";

const STORAGE_KEYS = {
  session: "bdp_demo_session",
  appointments: "bdp_demo_appointments",
  payments: "bdp_demo_payments",
  contacts: "bdp_demo_contacts",
};

const now = new Date().toISOString();
const defaultAppointments = [
  {
    id: "apt_1",
    name: "Ava Johnson",
    email: "ava@example.com",
    phone: "+1 876 555 0199",
    service: "Teeth Whitening",
    preferred_date: "2026-05-02",
    preferred_time: "10:30",
    notes: "First-time patient",
    status: "pending",
    created_at: now,
  },
  {
    id: "apt_2",
    name: "Marcus Brown",
    email: "marcus@example.com",
    phone: "+1 876 555 0112",
    service: "Cleaning",
    preferred_date: "2026-05-03",
    preferred_time: "13:30",
    notes: null,
    status: "confirmed",
    created_at: now,
  },
];

const defaultPayments = [
  {
    id: "pay_1",
    patient_name: "Ava Johnson",
    patient_email: "ava@example.com",
    service: "Teeth Whitening",
    amount: 160,
    status: "paid",
    method: "card",
    notes: "Paid at front desk",
    created_at: now,
  },
  {
    id: "pay_2",
    patient_name: "Marcus Brown",
    patient_email: "marcus@example.com",
    service: "Cleaning",
    amount: 90,
    status: "pending",
    method: "cash",
    notes: null,
    created_at: now,
  },
];

const defaultContacts = [
  {
    id: "msg_1",
    name: "Keisha Williams",
    email: "keisha@example.com",
    message: "Hi, do you offer Saturday cleanings?",
    created_at: now,
  },
];

function readJson(key, fallback) {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData() {
  if (!window.localStorage.getItem(STORAGE_KEYS.appointments)) {
    writeJson(STORAGE_KEYS.appointments, defaultAppointments);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.payments)) {
    writeJson(STORAGE_KEYS.payments, defaultPayments);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.contacts)) {
    writeJson(STORAGE_KEYS.contacts, defaultContacts);
  }
}

function createApiError(detail, status = 400) {
  const err = new Error(typeof detail === "string" ? detail : "Request failed");
  err.response = { status, data: { detail } };
  return err;
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function statsPayload() {
  const appointments = readJson(STORAGE_KEYS.appointments, defaultAppointments);
  const payments = readJson(STORAGE_KEYS.payments, defaultPayments);
  const contacts = readJson(STORAGE_KEYS.contacts, defaultContacts);

  return {
    appointments: {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    },
    payments: {
      total: payments.length,
      revenue: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount || 0), 0),
    },
    contacts: contacts.length,
  };
}

function getSessionUser() {
  const isAuthed = window.localStorage.getItem(STORAGE_KEYS.session) === "admin";
  return isAuthed ? { role: "admin", email: DEMO_ADMIN_EMAIL, name: "Demo Admin" } : null;
}

function requireAuth() {
  if (!getSessionUser()) throw createApiError("Not authenticated", 401);
}

ensureSeedData();

const api = {
  async get(path) {
    if (path === "/auth/me") {
      const user = getSessionUser();
      if (!user) throw createApiError("Not authenticated", 401);
      return { data: user };
    }

    requireAuth();
    if (path === "/appointments") {
      return { data: readJson(STORAGE_KEYS.appointments, defaultAppointments) };
    }
    if (path === "/payments") {
      return { data: readJson(STORAGE_KEYS.payments, defaultPayments) };
    }
    if (path === "/contact") {
      return { data: readJson(STORAGE_KEYS.contacts, defaultContacts) };
    }
    if (path === "/admin/stats") {
      return { data: statsPayload() };
    }
    throw createApiError("Route not found", 404);
  },

  async post(path, payload = {}) {
    if (path === "/auth/login") {
      const email = String(payload.email || "").trim().toLowerCase();
      const password = String(payload.password || "");
      if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
        throw createApiError("Invalid credentials", 401);
      }
      window.localStorage.setItem(STORAGE_KEYS.session, "admin");
      return { data: { role: "admin", email: DEMO_ADMIN_EMAIL, name: "Demo Admin" } };
    }

    if (path === "/auth/logout") {
      window.localStorage.removeItem(STORAGE_KEYS.session);
      return { data: { ok: true } };
    }

    if (path === "/appointments") {
      const appointments = readJson(STORAGE_KEYS.appointments, defaultAppointments);
      const item = {
        id: newId("apt"),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        service: payload.service,
        preferred_date: payload.preferred_date,
        preferred_time: payload.preferred_time,
        notes: payload.notes || null,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      writeJson(STORAGE_KEYS.appointments, [item, ...appointments]);
      return { data: item };
    }

    if (path === "/contact") {
      const contacts = readJson(STORAGE_KEYS.contacts, defaultContacts);
      const item = {
        id: newId("msg"),
        name: payload.name,
        email: payload.email,
        message: payload.message,
        created_at: new Date().toISOString(),
      };
      writeJson(STORAGE_KEYS.contacts, [item, ...contacts]);
      return { data: item };
    }

    requireAuth();
    if (path === "/payments") {
      const payments = readJson(STORAGE_KEYS.payments, defaultPayments);
      const item = {
        id: newId("pay"),
        patient_name: payload.patient_name,
        patient_email: payload.patient_email,
        service: payload.service,
        amount: Number(payload.amount || 0),
        status: payload.status || "pending",
        method: payload.method || "cash",
        notes: payload.notes || null,
        created_at: new Date().toISOString(),
      };
      writeJson(STORAGE_KEYS.payments, [item, ...payments]);
      return { data: item };
    }

    throw createApiError("Route not found", 404);
  },

  async patch(path, payload = {}) {
    requireAuth();

    if (path.startsWith("/appointments/")) {
      const id = path.replace("/appointments/", "");
      const appointments = readJson(STORAGE_KEYS.appointments, defaultAppointments);
      const index = appointments.findIndex((a) => a.id === id);
      if (index === -1) throw createApiError("Appointment not found", 404);
      appointments[index] = { ...appointments[index], ...payload };
      writeJson(STORAGE_KEYS.appointments, appointments);
      return { data: appointments[index] };
    }

    if (path.startsWith("/payments/")) {
      const id = path.replace("/payments/", "");
      const payments = readJson(STORAGE_KEYS.payments, defaultPayments);
      const index = payments.findIndex((p) => p.id === id);
      if (index === -1) throw createApiError("Payment not found", 404);
      payments[index] = { ...payments[index], ...payload };
      writeJson(STORAGE_KEYS.payments, payments);
      return { data: payments[index] };
    }

    throw createApiError("Route not found", 404);
  },

  async delete(path) {
    requireAuth();

    if (path.startsWith("/appointments/")) {
      const id = path.replace("/appointments/", "");
      const appointments = readJson(STORAGE_KEYS.appointments, defaultAppointments);
      writeJson(STORAGE_KEYS.appointments, appointments.filter((a) => a.id !== id));
      return { data: { ok: true } };
    }

    if (path.startsWith("/payments/")) {
      const id = path.replace("/payments/", "");
      const payments = readJson(STORAGE_KEYS.payments, defaultPayments);
      writeJson(STORAGE_KEYS.payments, payments.filter((p) => p.id !== id));
      return { data: { ok: true } };
    }

    throw createApiError("Route not found", 404);
  },
};

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default api;
