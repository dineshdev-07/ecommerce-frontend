import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

function Login({ setIsLoggedIn, setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("isAdmin", data.isAdmin);

      setIsLoggedIn(true);
      setIsAdmin(data.isAdmin === true);
      navigate("/");
    } catch {
      setError("Server error. Please try again.");
    }
  };
  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isAdmin");

    setEmail("");
    setPassword("");

    setIsLoggedIn(false);
    setIsAdmin(false);

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-4 py-8">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-green-700">
        FreshCart
      </h1>

      <p className="text-gray-500 mt-2">
        Sign in to continue shopping
      </p>
    </div>

    {error && (
      <p className="mb-4 text-center text-red-500 text-sm">
        {error}
      </p>
    )}

   <form onSubmit={submitHandler} className="space-y-4" autoComplete="off">

      <input
        type="email"
        placeholder="Email Address"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-gray-500"
        >
          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>
      </div>

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-green-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Login
      </button>
    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      Don't have an account?{" "}
      <Link
        to="/register"
        className="text-green-600 font-semibold hover:underline"
      >
        Register
      </Link>
    </div>

  </div>
</div>
  );
}

export default Login;
