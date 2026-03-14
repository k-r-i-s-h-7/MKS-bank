import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // default role
  const [customerId, setCustomerId] = useState<number | null>(null); // link to customer
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        username,
        password,
        role,
        customerId,
      });
      alert("Registration successful!");
      navigate("/"); // redirect to login page
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>
      <input
        placeholder="Customer ID (for customers)"
        type="number"
        value={customerId ?? ""}
        onChange={(e) => setCustomerId(Number(e.target.value))}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;