import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/api";
import AuthShell from "./AuthShell";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginSucceeded, setLoginSucceeded] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginSucceeded || !auth.token) return;

    navigate("/dashboard", { replace: true });

    const fallbackTimer = window.setTimeout(() => {
      if (window.location.pathname !== "/dashboard") {
        window.location.assign("/dashboard");
      }
    }, 400);

    return () => window.clearTimeout(fallbackTimer);
  }, [loginSucceeded, auth.token, navigate]);

  const login = async () => {
    try {
      setSubmitting(true);
      setError("");

      const res = await api.post("/auth/login", { username, password });
      const token = typeof res.data === "string" ? res.data : res.data?.token;

      if (!token) {
        setError("Login failed: token was not returned by server.");
        return;
      }

      auth.login(token);
      setLoginSucceeded(true);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.response?.data ||
          "Login failed. Check credentials or register first."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      badge="Client Access"
      title="A calmer banking interface for everyday operations."
      description="Sign in to review accounts, move funds, and operate the app from one consistent dashboard instead of a stack of unstyled forms."
      asideTitle="Built for controlled banking workflows"
      asideCopy="This project demonstrates a banking frontend connected to a Spring Boot API, PostgreSQL, Redis, and container-based deployment. The interface should feel operational, not improvised."
      asideStats={[
        { label: "Backend", value: "Spring Boot" },
        { label: "Data", value: "PostgreSQL" },
        { label: "Runtime", value: "Docker" },
      ]}
    >
      <div className="soft-panel p-6 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            Secure Sign-In
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-950">
            Welcome back
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the credentials you registered in this environment.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void login();
          }}
        >
          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              value={username}
              placeholder="Enter your username"
              className="text-input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              className="text-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <Link className="secondary-button" to="/register">
            Create New Profile
          </Link>
        </form>
      </div>
    </AuthShell>
  );
}
