import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  RotateCcw,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API}`,
  withCredentials: true,
});

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isPasswordValid = (pass) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[_\-@]).{8,}$/.test(pass);

  const passwordStrength = () => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[a-z]/.test(newPassword)) s++;
    if (/[_\-@]/.test(newPassword)) s++;
    return s;
  };

  const strengthColors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-[#6FAF8E]",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = passwordStrength();

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your registered email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/api/users/send-otp", { email });
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message || "User not found or server error.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (!isPasswordValid(newPassword)) {
      setError(
        "Password must be 8+ chars with uppercase, lowercase and (@, _, -).",
      );
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/users/reset-password", { email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">FreshCart</h1>

          <p className="text-gray-500 mt-2">Reset your password</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 1 ? "bg-green-600" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full ${
              step >= 2 ? "bg-green-600" : "bg-gray-200"
            }`}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-5">{error}</p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Forgot Password?
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Enter your registered email to receive an OTP.
              </p>
            </div>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                className="w-full border rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Reset Password
              </h2>

              <p className="text-sm text-gray-500 mt-2">OTP sent to</p>

              <p className="font-semibold text-green-700">{email}</p>
            </div>

            {/* OTP */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full border rounded-lg pl-11 pr-4 py-3 tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border rounded-lg pl-11 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength */}
            {newPassword && (
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded ${
                        i <= strength ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Password Strength:{" "}
                  <span className="font-semibold">
                    {strengthLabels[strength]}
                  </span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              onClick={handleSendOTP}
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 hover:text-green-600"
            >
              ← Change Email
            </button>

            <div className="text-center text-sm text-gray-600">
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
