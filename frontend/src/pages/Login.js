import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import { FaLock, FaUser, FaEye, FaEyeSlash, FaBalanceScale, FaFingerprint } from "react-icons/fa";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [error, setError] = useState("");
  const [showU, setShowU] = useState(false);
  const [showP, setShowP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  // --- DYNAMIC API SELECTION ---
  // Yeh automatic check karega: Localhost hai toh local IP, warna Render ka live link.
  const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000" 
    : "https://lawyer-management-system-8fwo.onrender.com";

  const login = async () => {
    setError("");
    if (!u.trim() || !p.trim()) {
      setError("⚠️ Authorization Required");
      return;
    }
    
    setIsLoading(true);
    const fd = new FormData();
    fd.append("username", u);
    fd.append("password", p);

    try {
      // API call with dynamic URL
      const r = await axios.post(`${API_BASE_URL}/login`, fd);
      
      if (r.data.success) {
        localStorage.setItem("admin", "yes");
        nav("/admin");
      } else {
        setError("❌ Invalid Access Token");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("❌ Encryption Error: Server Offline");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden px-4 py-10 font-sans">
      
      {/* --- DYNAMIC BACKGROUND DECOR --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-600/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-zinc-800/20 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[450px]"
      >
        <div className="text-center mb-6 md:mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-amber-500/80 text-[9px] md:text-[11px] font-black uppercase tracking-[0.6em]">
              Executive Terminal
            </span>
            <h2 className="text-zinc-400 text-xs md:text-sm italic mt-2 opacity-60 px-6">
              "Power is not given, it is taken by those who know the law."
            </h2>
          </motion.div>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-zinc-950/60 backdrop-blur-3xl border border-white/5 p-8 md:p-14 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>

          {/* BRANDING */}
          <div className="flex flex-col items-center mb-10 md:mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-amber-600/20 rounded-full blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
              <div className="relative bg-black border border-white/10 p-5 rounded-2xl mb-4 shadow-xl text-white">
                <FaBalanceScale className="text-amber-500 text-3xl md:text-4xl" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
              ADMIN <span className="text-amber-500 not-italic">PORTAL</span>
            </h1>
          </div>

          {/* INPUT SECTION */}
          <div className="space-y-6">
            <div className="space-y-2 text-white">
              <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black ml-1">Admin Identity</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                <input
                  type={showU ? "text" : "password"}
                  placeholder="USERNAME"
                  value={u}
                  onChange={e => setU(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-xl outline-none focus:border-amber-600/40 focus:bg-black transition-all text-sm font-bold text-zinc-200 placeholder:text-zinc-800"
                />
                <button onClick={() => setShowU(!showU)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-amber-500 transition-colors">
                  {showU ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-white">
              <label className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black ml-1">Master Key</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
                <input
                  type={showP ? "text" : "password"}
                  placeholder="••••••••"
                  value={p}
                  onChange={e => setP(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-xl outline-none focus:border-amber-600/40 focus:bg-black transition-all text-sm font-bold text-zinc-200"
                />
                <button onClick={() => setShowP(!showP)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-amber-500 transition-colors">
                  {showP ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={login}
            disabled={isLoading}
            className={`w-full mt-10 relative overflow-hidden group bg-amber-600 text-black py-4 md:py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-amber-600/20 transition-all ${isLoading ? "cursor-wait opacity-70" : ""}`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaFingerprint className="text-lg" /> Authorize Access
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </motion.button>
        </div>

        {/* BOTTOM SECURITY BADGE */}
        <div className="mt-10 flex flex-col items-center opacity-30">
          <div className="flex gap-4 mb-3">
            <div className="h-[1px] w-8 md:w-16 bg-zinc-800 self-center"></div>
            <p className="text-zinc-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]">Secure Terminal 001</p>
            <div className="h-[1px] w-8 md:w-16 bg-zinc-800 self-center"></div>
          </div>
          <p className="text-zinc-700 text-[7px] md:text-[9px] font-bold uppercase tracking-widest">
            End-to-End Encrypted Admin Session
          </p>
        </div>
      </motion.div>

      {/* FOOTER ACCENT */}
      <div className="absolute bottom-4 text-zinc-900 font-black text-[60px] md:text-[120px] select-none pointer-events-none opacity-[0.03] italic leading-none">
        JUSTICE
      </div>
    </div>
  );
}