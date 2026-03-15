import { useState, useContext } from "react"
import api from "../api/api"
import { AuthContext } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const login = async () => {
    const res = await api.post("/auth/login",{username,password})
    auth.login(res.data.token)
    navigate("/dashboard")
  }

  return (
    <div className="flex items-center justify-center h-screen">

      <div className="bg-black border border-gold rounded-xl p-10 w-96 shadow-xl">

        <h2 className="text-3xl font-bold text-gold mb-6 text-center">
          Secure Login
        </h2>

        <input
          placeholder="Username"
          className="w-full mb-4 p-3 rounded bg-dark border border-gray-700 focus:border-gold outline-none"
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-dark border border-gray-700 focus:border-gold outline-none"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-gold text-black font-bold py-3 rounded hover:opacity-90 transition"
        >
          Login
        </button>

      </div>

    </div>
  )
}