import { useState } from "react";
import api from "../api/api";
import AppShell from "./AppShell";

interface Account {
  id: number;
  balance: number;
  type: string;
}

const getErrorMessage = (e: any): string => {
  const data = e?.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  return "Unable to load accounts for this customer.";
};

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/accounts/customer/${customerId}`);
      setAccounts(res.data);
    } catch (e: any) {
      setAccounts([]);
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      eyebrow="Accounts"
      title="Customer Accounts"
      description="Load accounts by customer ID and review each balance in a layout that is easier to scan."
    >
      <section className="soft-panel p-5 sm:p-6">
        <form
          className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            void fetchAccounts();
          }}
        >
          <div>
            <label className="field-label" htmlFor="accounts-customer-id">
              Customer ID
            </label>
            <input
              id="accounts-customer-id"
              value={customerId}
              placeholder="Enter the customer identifier"
              className="text-input"
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>

          <button className="primary-button self-end sm:w-auto sm:px-6" type="submit">
            {loading ? "Loading..." : "Load Accounts"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {accounts.map((acc) => (
            <article
              key={acc.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Account
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-slate-950">
                    #{acc.id}
                  </h3>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                  {acc.type}
                </span>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Balance
              </p>
              <p className="mt-2 font-display text-3xl text-slate-950">
                Rs {acc.balance}
              </p>
            </article>
          ))}
        </div>

        {!loading && accounts.length === 0 && !error && (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-500">
            No accounts loaded yet. Enter a customer ID to fetch records.
          </div>
        )}
      </section>
    </AppShell>
  );
}
