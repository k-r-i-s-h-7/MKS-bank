import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import AuthShell from "./AuthShell";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const parsedCustomerId = customerId.trim() ? Number(customerId) : undefined;
      await api.post("/auth/register", {
        username,
        password,
        role: "CUSTOMER",
        customerId: parsedCustomerId,
      });

      setSuccess("Profile created. You can sign in now.");
      setTimeout(() => navigate("/"), 900);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Registration failed. Check the values and try again."
      );
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
            Customer ID is optional unless you need to link to an existing customer record.
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

          <div>
            <label className="field-label" htmlFor="customer-id">
              Customer ID
            </label>
            <input
              id="customer-id"
              value={customerId}
              placeholder="Optional existing customer reference"
              className="text-input"
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
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
