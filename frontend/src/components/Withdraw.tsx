import { useState } from "react";
import api from "../api/api";
import AppShell from "./AppShell";

export default function Withdraw() {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const withdraw = async () => {
    try {
      setSubmitting(true);
      setStatus("");
      setError("");

      await api.post(`/payments/withdraw?accountId=${accountId}&amount=${amount}`);
      setStatus("Withdrawal completed successfully.");
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Withdrawal failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      eyebrow="Payments"
      title="Withdraw Funds"
      description="Submit outbound fund movement against an account with consistent status handling."
    >
      <section className="soft-panel mx-auto max-w-2xl p-5 sm:p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void withdraw();
          }}
        >
          <div>
            <label className="field-label" htmlFor="withdraw-account-id">
              Account ID
            </label>
            <input
              id="withdraw-account-id"
              placeholder="Enter account ID"
              className="text-input"
              onChange={(e) => setAccountId(e.target.value)}
              value={accountId}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="withdraw-amount">
              Amount
            </label>
            <input
              id="withdraw-amount"
              placeholder="Enter withdrawal amount"
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

          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Submitting..." : "Withdraw Funds"}
          </button>
        </form>
      </section>
    </AppShell>
  );
}
