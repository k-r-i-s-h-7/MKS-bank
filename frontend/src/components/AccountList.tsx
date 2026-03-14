import React, { useEffect, useState } from "react";
import api from "../services/api";
import type { Account } from "../types";

interface AccountListProps {
  customerId: number;
}

const AccountList: React.FC<AccountListProps> = ({ customerId }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    api.get<Account[]>(`/accounts/customer/${customerId}`)
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error(err));
  }, [customerId]);

  return (
    <div>
      <h3>Accounts</h3>
      <ul>
        {accounts.map((a) => (
          <li key={a.id}>{a.type} - Balance: {a.balance}</li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;