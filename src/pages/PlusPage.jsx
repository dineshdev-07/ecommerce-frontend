import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Flame,
  Lock,
} from "lucide-react";
const API = import.meta.env.VITE_API_URL;

const config = { withCredentials: true };

const LoyaltyPage = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [isPlus, setIsPlus] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastRewardDate, setLastReward] = useState(null);
  const [expiryDate, setExpiry] = useState(null);
  const [processing, setProcessing] = useState(false);

  const maxCycles = 4;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${API}/api/users/profile`, config);
      setPoints(data.loyaltyPoints || 0);
      setIsPlus(data.isPlusMember || false);
      setStreak(data.streakCount || 0);
      setLastReward(data.lastStreakRewardDate);
      setExpiry(data.plusExpiryDate);
    } catch (err) {
      console.error(err);
    }
  };

  const getStreakStatus = () => {
    if (streak === 0) return "No active streak";
    if (streak >= maxCycles) return "Streak complete 🎉";
    if (!lastRewardDate) return "Cycle started";
    const diff = Math.ceil(
      (new Date(lastRewardDate).getTime() + 14 * 86400000 - Date.now()) /
        86400000,
    );
    return diff > 0 ? `${diff} days left to next cycle` : "Streak expired!";
  };

  const handleActivatePlus = async () => {
    try {
      setProcessing(true);
      await axios.post(`${API}/api/users/upgrade-plus`, {}, config);
      fetchUserData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const eligibleForPlus = streak >= maxCycles && !isPlus;
  const progress = Math.min(streak, maxCycles) / maxCycles;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Loyalty Rewards
            </h1>
            <p className="text-sm text-gray-500">
              Earn points and unlock FreshCart Plus
            </p>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available Points</p>

              <h2 className="text-4xl font-bold text-[#6FAF8E] mt-1">
                {points}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Crown className="text-[#6FAF8E]" size={28} />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-gray-600">Membership</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isPlus
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isPlus ? "Plus Member" : "Standard"}
            </span>
          </div>

          {isPlus && expiryDate && (
            <p className="mt-3 text-sm text-gray-500">
              Valid until{" "}
              <span className="font-semibold">
                {new Date(expiryDate).toLocaleDateString("en-IN")}
              </span>
            </p>
          )}
        </div>

        {/* Streak Card */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Flame className="text-orange-500" size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Shopping Streak</h3>

              <p className="text-sm text-gray-500">
                {Math.min(streak, maxCycles)} / {maxCycles} Cycles
              </p>
            </div>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full mt-5 overflow-hidden">
            <div
              className="h-full bg-[#6FAF8E] rounded-full"
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{Math.round(progress * 100)}% Completed</span>
            <span>{getStreakStatus()}</span>
          </div>
        </div>
        {/* Activate Plus */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {isPlus ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
                <Crown className="text-yellow-600" size={30} />
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                FreshCart Plus Active
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                You are enjoying all Plus member benefits.
              </p>
            </div>
          ) : eligibleForPlus ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                FreshCart Plus Unlocked 🎉
              </h3>

              <p className="text-sm text-gray-500 mb-5">
                Congratulations! Activate your Plus membership now.
              </p>

              <button
                onClick={handleActivatePlus}
                disabled={processing}
                className="w-full bg-[#6FAF8E] text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-60"
              >
                {processing ? "Activating..." : "Activate Plus"}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lock size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-800">Plus Locked</h3>
              </div>

              <p className="text-sm text-gray-500">
                Complete{" "}
                <span className="font-semibold">
                  {maxCycles - Math.min(streak, maxCycles)}
                </span>{" "}
                more cycle
                {maxCycles - Math.min(streak, maxCycles) !== 1 && "s"} to unlock
                FreshCart Plus.
              </p>
            </div>
          )}
        </div>

        {/* How to Earn Plus */}

        {!isPlus && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              How to Earn Plus
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-[#6FAF8E] font-bold flex items-center justify-center">
                  1
                </div>
                <p className="text-gray-600">
                  Spend ₹500 or more in one order.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-[#6FAF8E] font-bold flex items-center justify-center">
                  2
                </div>
                <p className="text-gray-600">Shop once every 14 days.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-[#6FAF8E] font-bold flex items-center justify-center">
                  3
                </div>
                <p className="text-gray-600">Complete 4 shopping cycles.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-[#6FAF8E] font-bold flex items-center justify-center">
                  4
                </div>
                <p className="text-gray-600">
                  Activate FreshCart Plus for free.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyPage;
