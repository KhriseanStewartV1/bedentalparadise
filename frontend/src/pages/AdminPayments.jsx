import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import api, { formatApiErrorDetail } from "../lib/api";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const statuses = ["paid", "pending", "refunded"];
const services = [
  "Examination", "Cleaning", "Teeth Whitening",
  "Fillings", "Crown & Bridge", "Dentures",
  "Extractions", "Root Canals", "Minor Oral Surgery",
];
const methods = ["cash", "card", "bank transfer", "insurance"];

export default function AdminPayments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patient_name: "", patient_email: "", service: services[0],
    amount: "", status: "pending", method: "cash", notes: "",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/payments");
      setRows(data);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!form.patient_name || !form.patient_email || !form.amount) {
      toast.error("Please fill required fields.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post("/payments", {
        patient_name: form.patient_name,
        patient_email: form.patient_email,
        service: form.service,
        amount: parseFloat(form.amount),
        status: form.status,
        method: form.method,
        notes: form.notes || null,
      });
      setRows((r) => [data, ...r]);
      setOpen(false);
      setForm({ patient_name: "", patient_email: "", service: services[0], amount: "", status: "pending", method: "cash", notes: "" });
      toast.success("Payment recorded");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/payments/${id}`, { status });
      setRows((r) => r.map((x) => (x.id === id ? data : x)));
      toast.success("Updated");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this payment record?")) return;
    try {
      await api.delete(`/payments/${id}`);
      setRows((r) => r.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed");
    }
  };

  const filtered = useMemo(() => rows.filter((r) => {
    const ok = statusFilter === "all" || r.status === statusFilter;
    const ql = q.toLowerCase();
    return ok && (!ql || r.patient_name.toLowerCase().includes(ql) ||
      r.patient_email.toLowerCase().includes(ql) ||
      r.service.toLowerCase().includes(ql));
  }), [rows, q, statusFilter]);

  const revenue = useMemo(() => filtered.filter((r) => r.status === "paid").reduce((s, r) => s + (r.amount || 0), 0), [filtered]);

  return (
    <div className="px-5 sm:px-8 py-8 max-w-7xl mx-auto" data-testid="admin-payments-page">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-paradise-sky font-semibold">Admin</div>
          <h1 className="font-display text-4xl text-paradise-navy mt-1">Payments</h1>
          <p className="text-sm text-paradise-slate mt-1">
            Track patient payments (manual records · <span className="text-amber-700 font-medium">MOCKED</span>, no live charges).
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary text-sm" data-testid="open-add-payment">
              <Plus className="w-4 h-4" /> Add payment
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-paradise-navy">Record a payment</DialogTitle>
              <DialogDescription className="text-sm text-paradise-slate">
                Manually track a patient payment (mocked · no live gateway).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={create} className="space-y-4 mt-2" data-testid="add-payment-form">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Patient name</Label>
                  <Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} data-testid="payment-name" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Patient email</Label>
                  <Input type="email" value={form.patient_email} onChange={(e) => setForm({ ...form, patient_email: e.target.value })} data-testid="payment-email" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Service</Label>
                  <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                    <SelectTrigger data-testid="payment-service"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Amount (USD)</Label>
                  <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} data-testid="payment-amount" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger data-testid="payment-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Method</Label>
                  <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                    <SelectTrigger data-testid="payment-method"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {methods.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-1 block">Notes</Label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} data-testid="payment-notes" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center disabled:opacity-60" disabled={saving} data-testid="payment-submit">
                {saving ? "Saving…" : "Save payment"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-paradise-slate uppercase tracking-wider">Revenue (filtered, paid)</div>
          <div className="font-display text-3xl text-paradise-navy mt-2">${revenue.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-paradise-slate uppercase tracking-wider">Records</div>
          <div className="font-display text-3xl text-paradise-navy mt-2">{filtered.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-paradise-slate uppercase tracking-wider">Paid</div>
          <div className="font-display text-3xl text-emerald-600 mt-2">{filtered.filter((r) => r.status === "paid").length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-paradise-slate uppercase tracking-wider">Pending</div>
          <div className="font-display text-3xl text-amber-600 mt-2">{filtered.filter((r) => r.status === "pending").length}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl mt-4 p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-paradise-slate" />
          <Input placeholder="Search patient, email, service" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-11 rounded-lg" data-testid="payments-search" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 sm:w-48 rounded-lg" data-testid="payments-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="payments-table">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-paradise-slate bg-slate-50 border-b border-slate-100">
                <th className="py-3 px-4 font-medium">Patient</th>
                <th className="py-3 px-4 font-medium">Service</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Method</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-paradise-slate">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-paradise-slate" data-testid="payments-empty">No payments yet.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/40" data-testid={`payment-row-${r.id}`}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-paradise-navy">{r.patient_name}</div>
                      <div className="text-xs text-paradise-slate">{r.patient_email}</div>
                    </td>
                    <td className="py-3 px-4">{r.service}</td>
                    <td className="py-3 px-4 font-medium text-paradise-navy">${Number(r.amount).toLocaleString()}</td>
                    <td className="py-3 px-4 capitalize">{r.method || "—"}</td>
                    <td className="py-3 px-4">
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className="h-9 w-32 rounded-lg" data-testid={`payment-status-select-${r.id}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-xs text-paradise-slate whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => remove(r.id)} className="text-rose-600 hover:text-rose-800 p-2 rounded hover:bg-rose-50" data-testid={`delete-payment-${r.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
