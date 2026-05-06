import { useState } from "react"
import api from "../api/api"

export default function Withdraw(){

  const [accountId,setAccountId] = useState("")
  const [amount,setAmount] = useState("")

  const withdraw = async () => {

    await api.post(
      `/payments/withdraw?accountId=${accountId}&amount=${amount}`
    )

    alert("Withdrawal Successful")
  }

  return (

    <div className="p-10 max-w-xl">

      <h1 className="text-3xl text-gold font-bold mb-8">
        Withdraw Funds
      </h1>

      <div className="bg-black border border-gold p-8 rounded-xl">

        <input
          placeholder="Account ID"
          className="w-full mb-4 p-3 bg-dark border border-gray-700 rounded"
          onChange={(e)=>setAccountId(e.target.value)}
        />

        <input
          placeholder="Amount"
          className="w-full mb-6 p-3 bg-dark border border-gray-700 rounded"
          onChange={(e)=>setAmount(e.target.value)}
        />

        <button
          onClick={withdraw}
          className="w-full bg-gold text-black py-3 rounded font-bold"
        >
          Withdraw
        </button>

      </div>

    </div>
  )
}