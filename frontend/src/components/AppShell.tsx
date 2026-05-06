import { useContext, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

type NavItem = {
  to: string;
  label: string;
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Overview" },
  { to: "/accounts", label: "Accounts" },
  { to: "/transfer", label: "Transfer" },
  { to: "/deposit", label: "Deposit" },
  { to: "/withdraw", label: "Withdraw" },
];

type AppShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AppShell({
  title,
  eyebrow,
  description,
  actions,
  children,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const logout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass-panel mb-6 overflow-hidden">
          <div className="flex flex-col gap-6 border-b border-white/60 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#083344,#0f766e)] text-lg font-semibold text-white shadow-lg shadow-teal-900/20">
                  MK
                </div>
                <div>
                  <p className="font-display text-xl tracking-[0.18em] text-slate-900">
                    MKS BANK
                  </p>
                  <p className="text-sm text-slate-500">
                    Retail banking control surface
                  </p>
                </div>
              </div>

              {eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                  {eyebrow}
                </p>
              )}
              <h1 className="font-display text-3xl text-slate-950 sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {description}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <div className="flex flex-wrap items-center justify-end gap-3">
                {actions}
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 px-5 py-4 sm:px-6">
            {navItems.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white/75 text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
