import type { ReactNode } from "react";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  asideTitle: string;
  asideCopy: string;
  asideStats: Array<{ label: string; value: string }>;
  children: ReactNode;
};

export default function AuthShell({
  badge,
  title,
  description,
  asideTitle,
  asideCopy,
  asideStats,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-teal-200/55 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-4rem] h-80 w-80 rounded-full bg-amber-200/65 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_65%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel flex flex-col justify-between px-6 py-7 sm:px-8 sm:py-8">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] text-lg font-semibold text-white shadow-lg shadow-teal-900/20">
                MK
              </div>
              <div>
                <p className="font-display text-xl tracking-[0.18em] text-slate-900">
                  MKS BANK
                </p>
                <p className="text-sm text-slate-500">
                  Core banking operations
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-teal-700">
                {badge}
              </p>
              <h1 className="max-w-xl font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                {description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {asideStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-sm shadow-slate-200/60"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-2xl text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-950 px-6 py-6 text-slate-100 shadow-2xl shadow-slate-900/20">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">
              Platform Context
            </p>
            <h2 className="mt-3 font-display text-2xl">{asideTitle}</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
              {asideCopy}
            </p>
          </div>
        </section>

        <section className="glass-panel flex items-center justify-center px-5 py-6 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </div>
  );
}
