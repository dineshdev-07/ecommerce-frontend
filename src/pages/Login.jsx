import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
      const res = await fetch(
        "const API = import.meta.env.VITE_API_URL;/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

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

  return (
    <div className="min-h-screen bg-[#e9eceb] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl h-[600px] flex rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        <div className="w-1/2 bg-[#f8f9f8] flex items-center justify-center px-10">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-sm text-center"
          >
            <h1 className="text-3xl font-black text-gray-900">Sign in</h1>

            <div className="mt-5 flex justify-center gap-3">
              {["f", "G+", "in"].map((item) => (
                <div
                  key={item}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-gray-600"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-400">or use your account</p>

            {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

            {/* INPUTS */}
            <input
              type="email"
              placeholder="Email"
              className="mt-4 w-full px-4 py-3 rounded-md bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-[#6FAF8E]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="mt-3 w-full px-4 py-3 rounded-md bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-[#6FAF8E]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-6 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Link
              to="/forgot-password"
              className="mt-4 block text-xs text-gray-400 hover:text-green-600"
            >
              Forgot your password?
            </Link>

            <button
              type="submit"
              className="mt-5 bg-[#6FAF8E] text-white px-10 py-3 rounded-full text-sm font-bold hover:bg-green-600 transition shadow-md"
            >
              SIGN IN
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 h-full bg-gradient-to-br from-[#4e8f4f] to-[#6FAF8E] flex items-center justify-center text-white">
          <div className="text-center px-6">
            <div className="mb-6">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                FreshCart
              </span>
            </div>

            <h2 className="text-3xl font-black mb-3">Hello, Friend!</h2>

            <p className="text-sm opacity-90 mb-6">
              Enter your personal details and start your fresh shopping journey
              with us
            </p>

            <Link to="/register">
              <button className="border border-white px-8 py-2 rounded-full hover:bg-white hover:text-green-600 transition">
                REGISTER
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
