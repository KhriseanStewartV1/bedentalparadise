import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import api, { formatApiErrorDetail } from "../lib/api";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const statuses = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments");
      setRows(data);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/appointments/${id}`, { status });
      setRows((r) => r.map((x) => (x.id === id ? data : x)));
      toast.success("Status updated");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to update");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setRows((r) => r.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail) || "Failed to delete");
    }
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const okStatus = statusFilter === "all" || r.status === statusFilter;
      const ql = q.toLowerCase();
      const okQ =
        !ql ||
        r.name.toLowerCase().includes(ql) ||
        r.email.toLowerCase().includes(ql) ||
        r.service.toLowerCase().includes(ql);
      return okStatus && okQ;
    });
  }, [rows, q, statusFilter]);

  return (
    <div className="px-5 sm:px-8 py-8 max-w-7xl mx-auto" data-testid="admin-appointments-page">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-paradise-sky font-semibold">Admin</div>
          <h1 className="font-display text-4xl text-paradise-navy mt-1">Appointments</h1>
          <p className="text-sm text-paradise-slate mt-1">Review, confirm and manage patient visits.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl mt-6 p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-paradise-slate" />
          <Input
            placeholder="Search name, email, or service"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-11 rounded-lg"
            data-testid="appointments-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 sm:w-48 rounded-lg" data-testid="appointments-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="appointments-table">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-paradise-slate bg-slate-50 border-b border-slate-100">
                <th className="py-3 px-4 font-medium">Patient</th>
                <th className="py-3 px-4 font-medium">Service</th>
                <th className="py-3 px-4 font-medium">Date / Time</th>
                <th className="py-3 px-4 font-medium">Phone</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-paradise-slate">Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-paradise-slate" data-testid="appointments-empty">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/40" data-testid={`appointment-row-${r.id}`}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-paradise-navy">{r.name}</div>
                      <div className="text-xs text-paradise-slate">{r.email}</div>
                      {r.notes ? <div className="text-xs text-paradise-slate mt-1 italic">"{r.notes}"</div> : null}
                    </td>
                    <td className="py-3 px-4">{r.service}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {r.preferred_date} <span className="text-paradise-slate">· {r.preferred_time}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{r.phone}</td>
                    <td className="py-3 px-4">
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className="h-9 w-36 rounded-lg" data-testid={`status-select-${r.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => remove(r.id)}
                        className="text-rose-600 hover:text-rose-800 p-2 rounded hover:bg-rose-50"
                        data-testid={`delete-appointment-${r.id}`}
                        aria-label="Delete"
                      >
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
