import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import api from "../lib/api";

export default function AdminMessages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/contact");
        setRows(data);
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="px-5 sm:px-8 py-8 max-w-5xl mx-auto" data-testid="admin-messages-page">
      <div className="text-xs uppercase tracking-[0.22em] text-paradise-sky font-semibold">Admin</div>
      <h1 className="font-display text-4xl text-paradise-navy mt-1">Messages</h1>
      <p className="text-sm text-paradise-slate mt-1">Notes received from the public contact form.</p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-paradise-slate">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-paradise-slate" data-testid="messages-empty">
            No messages yet.
          </div>
        ) : (
          rows.map((m) => (
            <article key={m.id} className="bg-white border border-slate-200 rounded-xl p-5" data-testid={`message-${m.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-paradise-skySoft text-paradise-sky flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-paradise-navy">{m.name}</div>
                    <div className="text-xs text-paradise-slate">{m.email}</div>
                  </div>
                </div>
                <div className="text-xs text-paradise-slate">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              <p className="mt-4 text-paradise-ink leading-relaxed">{m.message}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
