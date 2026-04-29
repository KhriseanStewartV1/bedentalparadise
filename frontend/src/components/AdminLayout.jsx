import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_dental-admin-hub-2/artifacts/k715mfhv_IMG-20260424-WA0025.jpg";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" data-testid="admin-layout">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <img src={LOGO_URL} alt="logo" className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <div className="font-display text-lg text-paradise-navy">Paradise</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-paradise-sky font-semibold">Admin</div>
          </div>
        </Link>
        <nav className="p-3 flex-1 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-paradise-skySoft text-paradise-navy font-medium"
                      : "text-paradise-slate hover:bg-slate-50 hover:text-paradise-navy"
                  }`
                }
                data-testid={`admin-nav-${n.label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="text-xs text-paradise-slate mb-2">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-paradise-slate hover:bg-slate-50 hover:text-paradise-navy"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-display text-paradise-navy">Paradise · Admin</span>
        </Link>
        <button onClick={handleLogout} className="text-sm text-paradise-slate">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 flex">
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 text-[10px] ${
                  isActive ? "text-paradise-navy" : "text-paradise-slate"
                }`
              }
              data-testid={`admin-nav-mobile-${n.label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          );
        })}
      </div>

      <main className="flex-1 md:pt-0 pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
