import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import lawyerImg from "../assets/lawyer.jpg";

// --- AUTOMATIC URL LOGIC ---
const BASE_URL = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:8000" 
  : "https://lawyer-management-system-8fwo.onrender.com";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Init AOS and fetch - (UPDATED WITH BASE_URL)
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    axios.get(`${BASE_URL}/blogs`)
       .then(r => setBlogs(r.data.reverse())) 
      .catch(err => {
        console.error("Blog Fetch Error:", err);
        setBlogs([]); 
      });
  }, []);

  // Featured slider logic
  const featured = blogs.slice(0, 3);
  useEffect(() => {
    if (featured.length > 0) {
      const interval = setInterval(() => {
        setSliderIndex((p) => (p + 1) % featured.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featured.length]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white px-4 md:px-16 py-12 md:py-20 font-sans overflow-hidden">
      
      {/* --- BG ELEMENTS --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-yellow-900/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-yellow-600 font-black uppercase text-[10px] tracking-[0.6em] mb-4">Legal Insights</h2>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 italic">CHRONICLES</span>
          </h1>
          <div className="h-1 w-20 bg-yellow-600 mx-auto mt-6 shadow-[0_0_15px_rgba(202,138,4,0.4)]"></div>
        </div>

        {blogs.length > 0 ? (
          <>
            {/* --- HERO SLIDER --- */}
            {featured.length > 0 && (
              <section className="relative h-[400px] md:h-[550px] mb-20 overflow-hidden rounded-[40px] border border-white/10 shadow-2xl group" data-aos="zoom-in">
                <img
                  src={featured[sliderIndex].image || lawyerImg}
                  alt={featured[sliderIndex].title}
                  className="w-full h-full object-cover transition-all duration-1000 transform scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16">
                  <div className="max-w-3xl" data-aos="fade-up" key={sliderIndex}>
                    <span className="bg-yellow-600 text-black text-[10px] font-black px-4 py-1 uppercase tracking-widest rounded-full mb-4 inline-block">Featured Insight</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-tighter">
                      {featured[sliderIndex].title}
                    </h2>
                    <p className="text-gray-300 text-sm md:text-lg font-medium leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                      {featured[sliderIndex].content}
                    </p>
                    <div className="flex gap-2">
                       {featured.map((_, dotIndex) => (
                         <div key={dotIndex} className={`h-1.5 transition-all duration-500 rounded-full ${sliderIndex === dotIndex ? 'w-12 bg-yellow-600' : 'w-3 bg-white/20'}`}></div>
                       ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* --- BLOG GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {blogs.map((b, i) => (
                <div
                  key={b.id}
                  className="group relative bg-zinc-900/20 backdrop-blur-sm p-8 md:p-10 rounded-[40px] border border-white/5 overflow-hidden transition-all duration-700 hover:border-yellow-600/30 hover:-translate-y-3"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-1000 pointer-events-none">
                    <img
                      src={b.image || lawyerImg}
                      alt="Lawyer Backdrop"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-4 block">Case Study / {i + 1}</span>
                    <h2 className="text-2xl font-black mb-4 text-white group-hover:text-yellow-500 transition-colors uppercase leading-tight tracking-tight">
                        {b.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1 group-hover:text-gray-200 transition-colors font-medium">
                      {b.content.length > 150 ? b.content.slice(0, 150) + "..." : b.content}
                    </p>
                    
                    <button
                      onClick={() => window.location.href = "/appointment"}
                      className="w-full py-4 border border-yellow-600/30 text-yellow-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-yellow-600 hover:text-black transition-all duration-500 group-hover:shadow-[0_10px_30px_rgba(202,138,4,0.2)]"
                    >
                      Secure Consultation
                    </button>
                  </div>
                  <div className="absolute top-0 left-0 w-0 h-1 bg-yellow-600 group-hover:w-full transition-all duration-700"></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-[50px]" data-aos="fade-up">
            <p className="text-gray-500 text-lg md:text-2xl uppercase tracking-[0.5em] font-black opacity-30 italic">
              Archives Under Seal...
            </p>
            <p className="text-yellow-600/50 text-[10px] mt-4 uppercase tracking-widest">Legal journals will be updated shortly.</p>
          </div>
        )}
      </div>

      <div className="mt-32 text-center opacity-30">
          <p className="text-[9px] tracking-[1em] uppercase font-black">Official Legal Journal • Adv. Umesh Suryawanshi</p>
      </div>
    </div>
  );
}