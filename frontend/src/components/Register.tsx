import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import AuthShell from "./AuthShell";

const getErrorMessage = (e: any): string => {
  const data = e?.response?.data;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  return "Registration failed. Check the values and try again.";
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdCustomerId, setCreatedCustomerId] = useState<number | null>(null);
  const [createdAccountId, setCreatedAccountId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const register = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      setCreatedCustomerId(null);
      setCreatedAccountId(null);

      const res = await api.post("/auth/register", {
        username,
        password,
        role: "CUSTOMER",
      });

      const customerId = res?.data?.customerId ?? null;
      const accountId = res?.data?.accountId ?? null;

      if (customerId) localStorage.setItem("customerId", String(customerId));
      if (accountId) localStorage.setItem("accountId", String(accountId));

      setSuccess("Profile created successfully.");
      setCreatedCustomerId(customerId);
      setCreatedAccountId(accountId);
    } catch (e: any) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      badge="New Access"
      title="Create an operator profile without the throwaway demo styling."
      description="Register a local customer login for this environment, then return to the sign-in screen and continue into the banking workspace."
      asideTitle="Registration can stand on its own"
      asideCopy="The original page exposed raw inputs with no structure or state handling. This version keeps the same backend contract while giving the flow proper spacing, hierarchy, and feedback."
      asideStats={[
        { label: "Role", value: "Customer" },
        { label: "Auth", value: "JWT" },
        { label: "Mode", value: "Local" },
      ]}
    >
      <div className="soft-panel p-6 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            Registration
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-950">
            Create profile
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Creating a profile now also creates your customer record and a default savings account automatically.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void register();
          }}
        >
          <div>
            <label className="field-label" htmlFor="register-username">
              Username
            </label>
            <input
              id="register-username"
              value={username}
              placeholder="Choose a username"
              className="text-input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              value={password}
              placeholder="Choose a password"
              type="password"
              className="text-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
              <p className="font-medium text-lg mb-3">{success}</p>
              <div className="space-y-2 bg-white/60 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider font-semibold text-emerald-700">Customer ID</span>
                  <span className="font-mono bg-emerald-100 px-2 py-1 rounded text-emerald-900 font-bold">{createdCustomerId ?? "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider font-semibold text-emerald-700">Account ID</span>
                  <span className="font-mono bg-emerald-100 px-2 py-1 rounded text-emerald-900 font-bold">{createdAccountId ?? "-"}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-emerald-700">
                Please make note of these IDs. You can now return to the sign-in screen.
              </p>
            </div>
          )}

          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? "Creating..." : "Create Profile"}
          </button>

          <Link className="secondary-button" to="/">
            Back to Sign In
          </Link>
        </form>
      </div>
    </AuthShell>
  );
}
