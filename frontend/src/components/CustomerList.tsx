import React, { useEffect, useState } from "react";
import api from "../services/api";
import type { Customer } from "../types";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.get<Customer[]>("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Customers</h2>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>{c.name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;