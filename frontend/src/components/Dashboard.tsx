import { Link } from "react-router-dom"

export default function Dashboard() {

  return (

    <div className="min-h-screen p-10">

      <h1 className="text-4xl font-bold text-gold mb-10">
        Banking Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <Link
          to="/accounts"
          className="bg-black border border-gold p-6 rounded-xl hover:bg-gray-900 transition"
        >
          <h2 className="text-xl text-gold font-semibold">
            View Accounts
          </h2>
          <p className="text-gray-400 mt-2">
            Manage and view account balances
          </p>
        </Link>

        <Link
          to="/transfer"
          className="bg-black border border-gold p-6 rounded-xl hover:bg-gray-900 transition"
        >
          <h2 className="text-xl text-gold font-semibold">
            Transfer Money
          </h2>
          <p className="text-gray-400 mt-2">
            Send funds between accounts
          </p>
        </Link>
        <Link
          to="/deposit"
          className="bg-black border border-gold p-6 rounded-xl hover:bg-gray-900 transition"
        >
          <h2 className="text-xl text-gold font-semibold">
            Deposit Amount
          </h2>
          <p className="text-gray-400 mt-2">
            Transfer money into your account
          </p>
        </Link>
        <Link
          to="/withdraw"
          className="bg-black border border-gold p-6 rounded-xl hover:bg-gray-900 transition"
        >
          <h2 className="text-xl text-gold font-semibold">
            Withdraw Amount
          </h2>
          <p className="text-gray-400 mt-2">
            Withdraw money from your account
          </p>
        </Link>

      </div>

    </div>

  )
}