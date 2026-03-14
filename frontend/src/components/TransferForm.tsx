import React, { useState } from "react";
import api from "../services/api";

const TransferForm: React.FC = () => {
  const [fromAccountId, setFromAccountId] = useState<number>(0);
  const [toAccountId, setToAccountId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  const handleTransfer = async () => {
    try {
      await api.post("/payments/transfer", null, {
        params: { fromAccountId, toAccountId, amount },
      });
      alert("Transfer successful");
    } catch (err) {
      alert("Transfer failed");
    }
  };

  return (
    <div>
      <h3>Transfer Money</h3>
      <input type="number" placeholder="From Account ID" onChange={e => setFromAccountId(+e.target.value)} />
      <input type="number" placeholder="To Account ID" onChange={e => setToAccountId(+e.target.value)} />
      <input type="number" placeholder="Amount" onChange={e => setAmount(+e.target.value)} />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
};

export default TransferForm;