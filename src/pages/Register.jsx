import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const api = axios.create({
  baseURL: "const API = import.meta.env.VITE_API_URL;.VITE_API_URL;",
  withCredentials: true,
});

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isPasswordValid = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[_\-@]).{8,}$/.test(pass);

  const passwordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[_\-@]/.test(password)) s++;
    return s;
  };

  const strength = passwordStrength();

  const strengthColors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  const handleSendOTP = async () => {
    if (!email) return setError("Enter your email");
    setError("");
    setLoading(true);

    try {
      await api.post("/api/users/send-otp", { email });
      setStep(2);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      return setError("Password not strong enough");
    }

    try {
      const { data } = await api.post("/api/users/register", {
        name,
        email,
        password,
        otp,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#e9eceb] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl h-[600px] flex rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
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

            <Link to="/login">
              <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-green-600 transition">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#f8f9f8] flex items-center justify-center px-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-black text-gray-900">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              Join us — fresh groceries await.
            </p>

            {/* STEP BAR */}
            <div className="flex gap-2 mb-6">
              <div
                className={`flex-1 h-1 rounded ${step >= 1 ? "bg-gray-900" : "bg-gray-200"}`}
              />
              <div
                className={`flex-1 h-1 rounded ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`}
              />
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border bg-white outline-none focus:ring-2 focus:ring-green-400"
                />

                <button
                  onClick={handleSendOTP}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                >
                  {loading ? "Sending..." : "Get OTP"}
                </button>

                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-green-600 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={submitHandler} className="space-y-4">
                <input
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border bg-white"
                  required
                />

                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border bg-white"
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                {/* PASSWORD STRENGTH */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i <= strength ? strengthColors[strength] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-sm text-gray-400"
                >
                  Resend OTP
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
