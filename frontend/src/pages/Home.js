import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Assets
import bgVideo from "../assets/bg-video.mp4";
import aboutBg from "../assets/About-bg.jpeg";
import profileImg from "../assets/Profile.png"; 

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  // COUNTER LOGIC (Restored)
  const [count, setCount] = useState(0);
  useEffect(() => {
    let i = 0;
    const c = setInterval(() => {
      i += 50;
      setCount(i);
      if (i >= 5000) clearInterval(c);
    }, 20);
    return () => clearInterval(c);
  }, []);

  // DATA (Restored)
  const testimonials = [
    { name: "Rajesh Malhotra", text: "Adv. Umesh handled my property case with extreme precision. Best lawyer in Thane.", rating: "★★★★★" },
    { name: "Priya Sharma", text: "Very professional and knowledgeable. He made a complex family matter very simple for us.", rating: "★★★★★" },
    { name: "Suresh Gupta", text: "His defense strategy in criminal matters is unmatched. Highly recommended!", rating: "★★★★★" }
  ];

  const associates = [
    { name: "Adv. P Singh", role: "Senior Associate - Family Law", exp: "12+ Yrs" },
    { name: "Adv. Rudransh Shukla", role: "Head of Civil Litigation", exp: "10+ Yrs" },
    { name: "Adv. Vedu Shukla", role: "Criminal Defense Expert", exp: "8+ Yrs" }
  ];

  // TESTIMONIAL SLIDER LOGIC (Restored)
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveTab((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-yellow-500 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center bg-[#0d0d0d] overflow-hidden pt-12 md:pt-0">
        <div className="absolute inset-0 z-0 opacity-25">
            <img src={aboutBg} className="w-full h-full object-cover blur-[2px]" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 flex justify-center md:justify-start" data-aos="fade-right">
            <div className="relative group">
              <div className="absolute -inset-6 md:-inset-8 bg-yellow-600/15 rounded-full blur-3xl transition-all group-hover:bg-yellow-600/25"></div>
              <img src={profileImg} alt="Adv. Umesh Suryawanshi" className="relative w-[240px] sm:w-[320px] md:w-full max-w-[550px] object-contain drop-shadow-[0_10px_60px_rgba(0,0,0,1)]" />
            </div>
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left" data-aos="fade-left">
            <div className="inline-block px-4 py-1.5 border border-yellow-600/30 bg-yellow-600/10 rounded-full mb-6 backdrop-blur-md">
               <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">B.A. LL.B (Hons) | Advocate High Court</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-[5.8rem] font-black uppercase tracking-tighter leading-[1] md:leading-[0.85] mb-6">
              ADV. UMESH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900">SURYAWANSHI</span>
            </h1>
            <p className="text-sm md:text-xl italic font-medium text-gray-400 mb-10 max-w-lg mx-auto md:mx-0">Upholding Justice through Expert Criminal, Civil & Family Jurisprudence.</p>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button onClick={() => navigate("/appointment")} className="group w-full sm:w-auto px-10 py-5 bg-yellow-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-yellow-500 transition-all shadow-[0_10px_30px_rgba(202,138,4,0.3)] active:scale-95">Book Consultation</button>
                <button onClick={() => window.open('tel:+919225644200')} className="w-full sm:w-auto px-10 py-5 border border-yellow-600/50 text-yellow-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-2 active:scale-95"><span>📞</span> Call Now</button>
              </div>

              {/* MAP ADDRESS BOX (Restored) */}
              <div 
                onClick={() => window.open('https://www.google.com/maps/search/Balkum,+Thane+400608', '_blank')}
                className="group relative p-5 bg-white/[0.03] border-l-4 border-yellow-600 backdrop-blur-xl rounded-r-lg max-w-md mx-auto md:mx-0 text-left cursor-pointer hover:bg-white/[0.08] transition-all border border-white/5"
              >
                  <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600 font-black mb-1 flex items-center gap-2">
                    Office Location <span className="text-[8px] bg-yellow-600/20 px-2 py-0.5 rounded text-yellow-500 animate-pulse">View Map</span>
                  </p>
                  <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed">
                    M32, Dadlani Park CHS, Balkum, <br />
                    Thane (West), Maharashtra 400608
                  </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRACTICES AREA --- */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-16" data-aos="fade-up">Legal <span className="text-yellow-600 italic font-light tracking-normal">Expertise</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Criminal Cases", desc: "Expert defense in high-profile criminal trials and bail applications.", icon: "⚖️" },
              { title: "Family Law", desc: "Resolving complex divorce, alimony, and child custody matters.", icon: "🏠" },
              { title: "Civil Litigation", desc: "Strategic handling of property disputes and legal contracts.", icon: "🏢" }
            ].map((item, i) => (
              <div key={i} className="group p-10 bg-zinc-900/10 border border-white/5 hover:border-yellow-600/40 hover:bg-yellow-600/[0.03] transition-all duration-500" data-aos="fade-up" data-aos-delay={i*100}>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-xl font-black uppercase mb-4 text-yellow-500 tracking-widest">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VIDEO SECTION --- */}
      <section className="relative h-[40vh] md:h-[65vh] flex items-center justify-center overflow-hidden border-y border-white/5">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale">
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="relative z-10 text-center px-6" data-aos="zoom-out">
          <h2 className="text-4xl md:text-8xl font-black uppercase text-white tracking-tighter leading-none">JUSTICE <span className="text-yellow-600">SERVED</span></h2>
          <p className="text-gray-400 mt-6 tracking-[0.5em] text-[10px] md:text-sm font-bold uppercase">Upholding the Law with Integrity & Power</p>
        </div>
      </section>

      {/* --- ASSOCIATES SECTION (Restored) --- */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
             <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter" data-aos="fade-right">Legal <br/><span className="text-yellow-600">Associates</span></h2>
             <p className="text-gray-500 max-w-sm text-[10px] md:text-sm uppercase font-bold tracking-widest md:text-right leading-loose">Our elite team of experts dedicated to your defense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {associates.map((lawyer, i) => (
              <div key={i} className="p-8 border border-white/5 bg-zinc-900/5 hover:border-yellow-600/50 hover:bg-white/[0.02] transition-all group relative overflow-hidden" data-aos="fade-up" data-aos-delay={i*150}>
                <div className="absolute top-0 left-0 w-1 h-0 bg-yellow-600 group-hover:h-full transition-all duration-500"></div>
                <span className="text-yellow-600 font-black text-[11px] tracking-widest uppercase">{lawyer.exp} Exp.</span>
                <h3 className="text-2xl font-black text-white mt-3 group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{lawyer.name}</h3>
                <p className="text-gray-500 text-[11px] mt-1 uppercase tracking-[0.2em] font-medium">{lawyer.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Restored & Polished) --- */}
      <section className="py-24 md:py-32 bg-[#080808] relative border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-xs md:text-lg font-black uppercase mb-16 tracking-[0.6em] text-gray-600">Client Chronicles</h2>
          <div className="min-h-[200px] flex flex-col justify-center">
               <div className="text-yellow-500 mb-6 text-xl tracking-widest transition-opacity duration-500">{testimonials[activeTab].rating}</div>
               <p className="text-xl md:text-4xl font-bold italic text-white mb-8 leading-snug transition-all duration-700 ease-in-out">
                 "{testimonials[activeTab].text}"
               </p>
               <h4 className="text-yellow-600 font-black uppercase text-xs tracking-[0.4em]">
                 — {testimonials[activeTab].name}
               </h4>
          </div>
          {/* Slider Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <div key={i} className={`h-1 transition-all duration-500 ${activeTab === i ? 'w-8 bg-yellow-600' : 'w-3 bg-gray-800'}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NUMBERS (Restored) --- */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[[count + "+", "Successful Clients"], ["6000+", "Cases Resolved"], ["High Court", "Legal Expert"], ["20+ Years", "Proven History"]].map((item, i) => (
            <div key={i} className="text-center" data-aos="zoom-in">
              <h3 className="text-4xl md:text-7xl font-black text-white outline-text mb-2 leading-none">{item[0]}</h3>
              <p className="text-gray-500 font-black uppercase text-[9px] md:text-[11px] tracking-[0.3em]">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER (Restored) --- */}
      <footer className="py-20 bg-[#050505] text-center border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <p className="text-2xl md:text-5xl font-black text-white uppercase mb-6 tracking-tighter">
                Adv. <span className="text-yellow-600">Umesh Suryawanshi</span>
            </p>
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500 text-[11px] md:text-sm leading-relaxed uppercase tracking-[0.2em] font-bold opacity-70">
                A distinguished legal practitioner with over two decades of experience in Mumbai High Court. 
                Dedicated to providing strategic defense.
              </p>
            </div>
            <div className="w-12 h-[3px] bg-yellow-600 mx-auto mt-10"></div>
         </div>
      </footer>

      {/* --- WHATSAPP (Restored) --- */}
      <a href="https://wa.me/919225644200" className="fixed bottom-6 right-6 z-50 bg-[#25D366] p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform active:scale-90">
           <svg className="w-6 h-6 md:w-8 md:h-8 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      <style jsx>{`
        .outline-text { -webkit-text-stroke: 1px rgba(255,255,255,0.1); color: transparent; transition: all 0.4s ease; }
        .outline-text:hover { -webkit-text-stroke: 1px #ca8a04; color: rgba(202,138,4,0.05); }
        @media (max-width: 768px) { .outline-text { -webkit-text-stroke: 0.5px rgba(255,255,255,0.2); } }
      `}</style>
    </div>
  );
}