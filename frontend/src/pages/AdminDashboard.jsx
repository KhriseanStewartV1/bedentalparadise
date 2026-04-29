import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock3, CheckCircle2, DollarSign, Users, MessageSquare, ArrowUpRight } from "lucide-react";
import api from "../lib/api";

const statConfig = [
  { key: "total", label: "Total appointments", icon: CalendarDays, color: "text-paradise-navy", bg: "bg-paradise-skySoft" },
  { key: "pending", label: "Pending", icon: Clock3, color: "text-amber-700", bg: "bg-amber-50" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-paradise-green", bg: "bg-emerald-50" },
  { key: "completed", label: "Completed", icon: Users, color: "text-paradise-sky", bg: "bg-sky-50" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, a] = await Promise.all([api.get("/admin/stats"), api.get("/appointments")]);
        setStats(s.data);
        setRecent(a.data.slice(0, 5));
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return (
    <div className="px-5 sm:px-8 py-8 max-w-7xl mx-auto" data-testid="admin-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-paradise-sky font-semibold">Admin</div>
          <h1 className="font-display text-4xl text-paradise-navy mt-1">Dashboard</h1>
        </div>
        <div className="text-sm text-paradise-slate">
          {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {statConfig.map((s) => {
          const Icon = s.icon;
          const v = stats?.appointments?.[s.key] ?? "—";
          return (
            <div key={s.key} className="bg-white border border-slate-200 rounded-xl p-5" data-testid={`stat-${s.key}`}>
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 font-display text-3xl text-paradise-navy">{v}</div>
              <div className="text-xs text-paradise-slate mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-1" data-testid="stat-revenue">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-paradise-slate">Mocked</span>
          </div>
          <div className="mt-4 font-display text-3xl text-paradise-navy">
            ${Number(stats?.payments?.revenue ?? 0).toLocaleString()}
          </div>
          <div className="text-xs text-paradise-slate mt-1">
            Total revenue · {stats?.payments?.total ?? 0} records
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5" data-testid="stat-messages">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-paradise-sky flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="mt-4 font-display text-3xl text-paradise-navy">{stats?.contacts ?? 0}</div>
          <div className="text-xs text-paradise-slate mt-1">Inbox messages</div>
        </div>

        <div className="bg-paradise-navy text-white rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-paradise-sky/20 blur-2xl" />
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-paradise-yellow font-semibold">Quick action</div>
            <div className="font-display text-2xl mt-2 leading-tight">Record a new payment</div>
          </div>
          <Link to="/admin/payments" className="btn-secondary w-max text-sm mt-5" data-testid="dashboard-add-payment-btn">
            Add payment →
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mt-4" data-testid="dashboard-recent-appointments">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl text-paradise-navy">Recent appointments</h3>
          <Link to="/admin/appointments" className="text-sm text-paradise-sky flex items-center gap-1 hover:text-paradise-navy">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-sm text-paradise-slate py-6 text-center">No appointments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-paradise-slate border-b border-slate-100">
                  <th className="py-2 pr-4 font-medium">Patient</th>
                  <th className="py-2 pr-4 font-medium">Service</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Time</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-paradise-navy">{r.name}</div>
                      <div className="text-xs text-paradise-slate">{r.email}</div>
                    </td>
                    <td className="py-3 pr-4">{r.service}</td>
                    <td className="py-3 pr-4">{r.preferred_date}</td>
                    <td className="py-3 pr-4">{r.preferred_time}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-sky-100 text-sky-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
