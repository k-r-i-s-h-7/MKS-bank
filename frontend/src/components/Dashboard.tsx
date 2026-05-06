import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import AppShell from "./AppShell";
import { AuthContext } from "../auth/AuthContext";

const quickActions = [
  {
    to: "/accounts",
    title: "View accounts",
    description: "Load balances and account types for a customer record.",
  },
  {
    to: "/transfer",
    title: "Transfer funds",
    description: "Move money between accounts with a direct payment request.",
  },
  {
    to: "/deposit",
    title: "Deposit",
    description: "Post inbound funds into a selected account.",
  },
  {
    to: "/withdraw",
    title: "Withdraw",
    description: "Submit a debit operation against an existing account.",
  },
];

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const [customerId, setCustomerId] = useState<number | null>(auth.customerId);
  const [accountId, setAccountId] = useState<number | null>(auth.accountId);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string>("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setProfileError("");
        const res = await api.get("/auth/me");

        if (!active) return;

        const fetchedCustomerId = res.data?.customerId ?? null;
        const fetchedAccountId = res.data?.accountId ?? null;

        setCustomerId(fetchedCustomerId);
        setAccountId(fetchedAccountId);
        setAccountType(res.data?.accountType ?? null);

        if (fetchedCustomerId && fetchedAccountId) {
          auth.setProfile(fetchedCustomerId, fetchedAccountId);
        }
      } catch (e: any) {
        if (!active) return;

        const data = e?.response?.data;
        if (typeof data === "string") {
          setProfileError(data);
        } else if (typeof data?.message === "string") {
          setProfileError(data.message);
        } else {
          setProfileError("Unable to load profile identifiers.");
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell
      eyebrow="Workspace"
      title="Banking Dashboard"
      description="Use the core transaction actions below. The interface is intentionally compact and operational instead of decorative."
    >
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="soft-panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
                Primary Actions
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                Daily banking tasks
              </h2>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              4 active routes
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <Link
                key={action.to}
                to={action.to}
                className="group rounded-[24px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-100/70"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <h3 className="font-display text-2xl text-slate-950">
                  {action.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {action.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-teal-700 transition group-hover:text-teal-800">
                  Open workspace
                </p>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="soft-panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
              Logged-in profile
            </p>
            <h2 className="mt-2 font-display text-2xl text-slate-950">
              Identifier snapshot
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Customer ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-950">
                    {customerId ?? "-"}
                  </span>
                  {customerId && (
                    <button
                      onClick={() => navigator.clipboard.writeText(String(customerId))}
                      className="text-xs text-teal-600 hover:text-teal-800 bg-teal-50 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Account ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-950">
                    {accountId ?? "-"}
                  </span>
                  {accountId && (
                    <button
                      onClick={() => navigator.clipboard.writeText(String(accountId))}
                      className="text-xs text-teal-600 hover:text-teal-800 bg-teal-50 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
              {accountType && (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Account Type
                  </span>
                  <span className="font-semibold text-slate-950">
                    {accountType}
                  </span>
                </div>
              )}
            </div>
            {profileError && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {profileError}
              </div>
            )}
          </section>

          <section className="soft-panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
              Platform
            </p>
            <h2 className="mt-2 font-display text-2xl text-slate-950">
              Current stack
            </h2>
            <div className="mt-5 grid gap-3">
              {[
                "React + Vite frontend",
                "Spring Boot API",
                "PostgreSQL persistence",
                "Redis cache",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-slate-950 p-5 text-slate-100 shadow-2xl shadow-slate-900/15 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">
              Direction
            </p>
            <h2 className="mt-2 font-display text-2xl">
              Better than stitched demo screens
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The app now has a shared shell, consistent spacing, and readable transaction pages. It still uses the same backend endpoints and flow.
            </p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
