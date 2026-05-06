import { useState } from "react";
import api from "../api/api";
import AppShell from "./AppShell";

export default function Transfer() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const transfer = async () => {
    try {
      setSubmitting(true);
      setStatus("");
      setError("");
      await api.post(
        `/payments/transfer?fromAccountId=${from}&toAccountId=${to}&amount=${amount}`
      );
      setStatus("Transfer completed successfully.");
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Transfer failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      eyebrow="Payments"
      title="Transfer Funds"
      description="Move money between two account IDs using the existing payments endpoint."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] bg-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-900/15">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">
            Transfer guidance
          </p>
          <h2 className="mt-2 font-display text-3xl">Two-account movement</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Use this page for direct account-to-account movement. Keep both IDs and the transfer amount available before submitting.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Provide source account",
              "Provide destination account",
              "Confirm amount before submit",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="soft-panel p-5 sm:p-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void transfer();
            }}
          >
            <div>
              <label className="field-label" htmlFor="from-account">
                From Account
              </label>
              <input
                id="from-account"
                placeholder="Enter sender account ID"
                className="text-input"
                onChange={(e) => setFrom(e.target.value)}
                value={from}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="to-account">
                To Account
              </label>
              <input
                id="to-account"
                placeholder="Enter receiver account ID"
                className="text-input"
                onChange={(e) => setTo(e.target.value)}
                value={to}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="transfer-amount">
                Amount
              </label>
              <input
                id="transfer-amount"
                type="number"
                placeholder="0.00"
                className="text-input"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </div>

            {status && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {status}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button className="primary-button" disabled={submitting} type="submit">
              {submitting ? "Submitting..." : "Send Transfer"}
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
