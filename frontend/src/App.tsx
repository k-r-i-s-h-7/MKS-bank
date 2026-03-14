import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CustomerList from "./components/CustomerList";
import AccountList from "./components/AccountList";
import TransferForm from "./components/TransferForm";

function App() {
  const handleLogin = () => {
    console.log("Logged in");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={
          <div>
            <CustomerList />
            <AccountList customerId={1} />
            <TransferForm />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;