import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

import lawyerImg from "../assets/Profile.png";

// --- SKELETON COMPONENT FOR SERVICES ---
const ServiceSkeleton = () => (
  <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-[40px] border border-white/5 animate-pulse">
    <div className="mb-10 w-14 h-14 rounded-2xl bg-zinc-800"></div>
    <div className="h-8 w-3/4 bg-zinc-800 rounded mb-5"></div>
    <div className="h-4 w-full bg-zinc-800 rounded mb-2"></div>
    <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>
  </div>
);

export default function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- DYNAMIC API SELECTION ---
  const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000" 
    : "https://lawyer-management-system-8fwo.onrender.com";

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });

    // 1. CACHE CHECK: Pehle browser memory se purana data check karo
    const cachedServices = localStorage.getItem("cached_services");
    if (cachedServices) {
      setServices(JSON.parse(cachedServices));
      setIsLoading(false); // Cache milte hi loader band
    }
    
    // 2. LIVE FETCH: Background mein Render se naya data lao
    axios.get(`${API_BASE_URL}/services`)
      .then(r => {
        setServices(r.data);
        setIsLoading(false);
        // Naye data ko cache mein update karo
        localStorage.setItem("cached_services", JSON.stringify(r.data));
      })
      .catch(err => {
        console.error("Services Fetch Error:", err);
        if (!cachedServices) setServices([]); 
        setIsLoading(false);
      });
  }, [API_BASE_URL]);

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 md:px-16 py-12 md:py-24 relative overflow-hidden">
      
      {/* PREMIUM BG SYNERGY */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-yellow-900/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-16 md:mb-28 relative z-10">
        <h2 className="text-yellow-600 font-black uppercase text-[10px] md:text-xs tracking-[0.5em] mb-4" data-aos="fade-up">
          High Court Practice
        </h2>
        <h1 className="text-4xl md:text-8xl font-black text-white text-center tracking-tighter uppercase leading-none" data-aos="fade-down">
          Legal <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-800 italic font-light tracking-normal">Solutions</span>
        </h1>
        <div className="h-1 w-20 md:w-32 bg-yellow-600 mx-auto mt-8 shadow-[0_0_15px_rgba(202,138,4,0.5)]"></div>
      </div>

      {/* SERVICES GRID */}
      <div className="max-w-7xl mx-auto relative z-10">
        {isLoading && services.length === 0 ? (
          // Agar network slow hai aur cache empty hai, toh 6 skeletons dikhao
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {[1, 2, 3, 4, 5, 6].map(n => <ServiceSkeleton key={n} />)}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {services.map((s, i) => (
              <div
                key={s.id || i}
                className="group relative bg-[#0a0a0a] p-8 md:p-12 rounded-[40px] border border-white/5 overflow-hidden transition-all duration-700 hover:border-yellow-600/40 hover:-translate-y-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="absolute top-0 left-0 w-2 h-0 bg-yellow-600 group-hover:h-full transition-all duration-500"></div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-1000 pointer-events-none">
                  <img src={lawyerImg} alt="Backdrop" className="w-full h-full object-cover grayscale" />
                </div>

                <div className="relative z-10">
                  <div className="mb-10 w-14 h-14 rounded-2xl border border-yellow-600/20 flex items-center justify-center bg-white/[0.03] text-yellow-500 group-hover:bg-yellow-600 group-hover:text-black transition-all duration-500 shadow-xl">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black mb-5 text-white group-hover:text-yellow-500 transition-colors uppercase tracking-tight leading-tight">
                    {s.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium group-hover:text-gray-300 transition-colors italic">
                    {s.description}
                  </p>

                  <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Secure Consultation</span>
                    <span className="text-yellow-600 text-xl">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-40 bg-white/[0.01] border border-white/5 rounded-[50px]">
            <p className="text-gray-600 text-sm md:text-xl uppercase tracking-[0.5em] font-black italic">
              No Services Found
            </p>
          </div>
        )}
      </div>

      <div className="mt-32 text-center">
          <div className="h-[1px] w-full max-w-xs bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent mx-auto mb-6"></div>
          <p className="text-[9px] md:text-[11px] tracking-[1.2em] font-black text-gray-600 uppercase">
            Adv. Umesh Suryawanshi • High Court Advocate
          </p>
      </div>
    </div>
  );
}