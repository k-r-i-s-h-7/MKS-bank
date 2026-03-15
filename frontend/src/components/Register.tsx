import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [customerId, setCustomerId] = useState("");

  const register = async () => {
    await api.post("/auth/register", {
      username,
      password,
      role: "CUSTOMER",
      customerId: Number(customerId),
    });

    alert("User created!");
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="customer id"
        onChange={(e) => setCustomerId(e.target.value)}
      />

      <button onClick={register}>Register</button>
    </div>
  );
}