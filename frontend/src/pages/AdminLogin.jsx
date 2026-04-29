import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_dental-admin-hub-2/artifacts/k715mfhv_IMG-20260424-WA0025.jpg";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === "admin") navigate("/admin", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password.");
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success("Welcome back, Admin.");
      navigate("/admin", { replace: true });
    } else {
      toast.error(res.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paradise-skySoft" data-testid="admin-login-page">
      <div className="hidden lg:flex relative items-center justify-center bg-paradise-navy text-white p-12 overflow-hidden">
        <div className="absolute top-10 -right-20 w-[400px] h-[400px] rounded-full bg-paradise-sky/20 blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-[400px] h-[400px] rounded-full bg-paradise-yellow/10 blur-3xl" />
        <div className="relative max-w-md">
          <img src={LOGO_URL} alt="Be Dental Paradise" className="h-16 w-16 rounded-full ring-2 ring-white/30" />
          <h1 className="font-display text-5xl mt-8 leading-tight">
            Admin Portal
            <span className="block italic text-paradise-yellow font-medium text-3xl mt-2">
              manage paradise, one smile at a time.
            </span>
          </h1>
          <p className="text-white/75 mt-6 leading-relaxed">
            Sign in to review appointment requests, track payments, and keep every patient's
            visit running smoothly.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-white/80">
            <ShieldCheck className="w-5 h-5 text-paradise-yellow" />
            Secure JWT session · auto-expiring tokens
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-hover p-8 sm:p-10 border border-slate-100" data-testid="admin-login-form">
          <Link to="/" className="text-xs uppercase tracking-[0.22em] text-paradise-sky font-semibold">
            ← Back to site
          </Link>
          <h2 className="font-display text-4xl text-paradise-navy mt-4">Welcome back</h2>
          <p className="text-paradise-slate mt-2 text-sm">Sign in to the Be Dental Paradise admin.</p>

          <div className="mt-8 space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bedentalparadise.com"
                className="h-12 rounded-xl"
                data-testid="admin-login-email"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl"
                data-testid="admin-login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-8 disabled:opacity-60"
            data-testid="admin-login-submit"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-xs text-paradise-slate text-center mt-6">
            Only authorized clinic admins may access this area.
          </p>
        </form>
      </div>
    </div>
  );
}
