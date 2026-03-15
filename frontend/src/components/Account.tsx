import { useState } from "react"
import api from "../api/api"

interface Account {
  id:number
  balance:number
  type:string
}

export default function Accounts(){

  const [accounts,setAccounts] = useState<Account[]>([])
  const [customerId,setCustomerId] = useState("")

  const fetchAccounts = async () => {
    const res = await api.get(`/accounts/customer/${customerId}`)
    setAccounts(res.data)
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl text-gold font-bold mb-6">
        Your Accounts
      </h1>

      <div className="flex gap-4 mb-8">

        <input
          placeholder="Customer ID"
          className="p-3 bg-black border border-gray-700 rounded"
          onChange={(e)=>setCustomerId(e.target.value)}
        />

        <button
          onClick={fetchAccounts}
          className="bg-gold text-black px-6 rounded font-semibold"
        >
          Load Accounts
        </button>

      </div>

      <div className="grid grid-cols-3 gap-6">

        {accounts.map((acc)=>(
          <div
            key={acc.id}
            className="bg-black border border-gold p-6 rounded-xl shadow-lg"
          >

            <h3 className="text-gold font-bold text-lg">
              Account #{acc.id}
            </h3>

            <p className="mt-2 text-gray-300">
              Balance: ₹{acc.balance}
            </p>

            <p className="text-gray-500">
              Type: {acc.type}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}