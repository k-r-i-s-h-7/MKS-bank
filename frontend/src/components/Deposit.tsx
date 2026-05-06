import { useState } from "react"
import api from "../api/api"

export default function Deposit(){

  const [accountId,setAccountId] = useState("")
  const [amount,setAmount] = useState("")

  const deposit = async () => {

    await api.post(
      `/payments/deposit?accountId=${accountId}&amount=${amount}`
    )

    alert("Deposit Successful")
  }

  return (

    <div className="p-10 max-w-xl">

      <h1 className="text-3xl text-gold font-bold mb-8">
        Deposit Funds
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
          onClick={deposit}
          className="w-full bg-gold text-black py-3 rounded font-bold"
        >
          Deposit
        </button>

      </div>

    </div>
  )
}