import { useState } from "react";
import api from "../api/api";

export default function Transfer() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const transfer = async () => {
    try {
      await api.post(
        `/payments/transfer?fromAccountId=${from}&toAccountId=${to}&amount=${amount}`
      );
      alert("Transfer Successful");
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer Failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-12">
      {/* Header with Gold Gradient */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FDB931] mb-8 text-center tracking-wide drop-shadow-sm">
        Transfer Money
      </h1>

      {/* Main Card */}
      <div className="bg-[#050505] border border-[#FFD700]/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.05)]">
        <div className="flex flex-col gap-6">
          
          {/* From Account Input */}
          <div>
            <label className="block text-[#FFD700] text-xs font-bold mb-2 tracking-widest uppercase">
              From Account
            </label>
            <input
              placeholder="Enter sender ID"
              className="w-full p-4 bg-[#111] text-white border border-gray-800 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-300 placeholder-gray-600"
              onChange={(e) => setFrom(e.target.value)}
              value={from}
            />
          </div>
          <h1 className="text-4xl text-gold bg-black p-10">
Test Tailwind
</h1>
          {/* To Account Input */}
          <div>
            <label className="block text-[#FFD700] text-xs font-bold mb-2 tracking-widest uppercase">
              To Account
            </label>
            <input
              placeholder="Enter recipient ID"
              className="w-full p-4 bg-[#111] text-white border border-gray-800 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-300 placeholder-gray-600"
              onChange={(e) => setTo(e.target.value)}
              value={to}
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-white text-xs font-bold mb-2 tracking-widest uppercase">
              Amount ($)
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-4 bg-[#111] text-white border border-gray-800 rounded-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300 placeholder-gray-600"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={transfer}
            className="mt-4 w-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black py-4 rounded-lg font-extrabold text-lg tracking-wide hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Send Transfer
          </button>
          
        </div>
      </div>
    </div>
  );
}