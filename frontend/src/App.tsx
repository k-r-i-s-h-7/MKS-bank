import { useContext } from "react";
import type { ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Accounts from "./components/Account";
import Transfer from "./components/Transfer";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import { AuthContext } from "./auth/AuthContext";

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { token } = useContext(AuthContext);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
