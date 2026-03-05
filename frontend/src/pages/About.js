import { FaInstagram, FaFacebook, FaPhoneAlt, FaEnvelope, FaGraduationCap, FaAward, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import lawyerImg from "../assets/Profile.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: false });
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-20 flex flex-col lg:flex-row gap-16 bg-[#050505] text-gray-100 overflow-hidden relative">
      
      {/* --- BACKGROUND LUXURY ELEMENTS --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-yellow-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-yellow-900/5 blur-[120px] rounded-full"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      {/* --- IMAGE SECTION: THE "LEGACY" FRAME --- */}
      <div className="lg:w-2/5 flex justify-center items-start relative" data-aos="fade-right">
        <div className="relative group w-full max-w-[450px]">
          {/* Multi-layered Border Effect */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-700 via-yellow-500/20 to-transparent rounded-[30px] blur-sm opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={lawyerImg}
              alt="Adv. Umesh Suryawanshi"
              className="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 object-cover"
            />
            {/* Overlay Gradient on Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
          
          {/* Experience Badge: Floating Glass Style */}
          <div className="absolute -bottom-8 -right-4 md:-right-8 bg-yellow-600/90 backdrop-blur-xl text-black p-6 md:p-8 rounded-2xl shadow-[0_20px_40px_rgba(202,138,4,0.3)] transform group-hover:-translate-y-2 transition-transform duration-500">
            <p className="text-4xl md:text-5xl font-black leading-none tracking-tighter">15+</p>
            <p className="text-[10px] md:text-xs uppercase font-black tracking-[0.2em] mt-1">Years of <br/> Excellence</p>
          </div>
        </div>
      </div>

      {/* --- INFO SECTION: THE "GLASS" DOSSIER --- */}
      <div className="flex-1 flex flex-col gap-10 bg-gradient-to-br from-white/[0.07] to-transparent backdrop-blur-2xl p-8 md:p-16 rounded-[50px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative" data-aos="fade-left">
        
        {/* Header Section */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-yellow-600"></div>
            <h1 className="text-xs md:text-sm font-black text-yellow-500 tracking-[0.5em] uppercase">
              Principal Advocate
            </h1>
          </div>
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
            UMESH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-800">SURYAWANSHI</span>
          </h2>
        </div>

        {/* Biography Section */}
        <div className="space-y-8 text-gray-300 text-lg md:text-2xl font-light leading-relaxed max-w-3xl">
          <p data-aos="fade-up" className="first-letter:text-5xl first-letter:font-black first-letter:text-yellow-600 first-letter:mr-3 first-letter:float-left">
            Based in <span className="text-white font-bold italic border-b border-yellow-600/50">Thane & Mumbai</span>, I specialize in high-stakes <span className="text-yellow-500 font-medium">Criminal Defense</span> and complex <span className="text-yellow-500 font-medium">Family Law</span> litigations within the High Court.
          </p>
          <div data-aos="fade-up" data-aos-delay="200" className="relative group">
             <div className="absolute left-0 top-0 h-full w-1.5 bg-yellow-600 rounded-full"></div>
             <p className="pl-8 italic text-gray-400 text-base md:text-xl font-medium py-2 group-hover:text-white transition-colors">
               "My mission is simple: To provide a legal shield that is unbreakable. We don't just handle cases; we deliver results with absolute power."
             </p>
          </div>
        </div>

        {/* DETAILS GRID: ELITE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-10 border-t border-white/5" data-aos="fade-up" data-aos-delay="300">
          
          {/* Call - Premium Card */}
          <a href="tel:+919225644200" className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-600/30 hover:bg-white/10 transition-all duration-500 group">
            <div className="p-4 bg-yellow-600 text-black rounded-xl shadow-[0_0_20px_rgba(202,138,4,0.3)] group-hover:rotate-12 transition-transform">
              <FaPhoneAlt size={18} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-yellow-600 tracking-widest">Consultation Line</p>
              <p className="font-bold text-white text-lg tracking-tight">+91 9225644200</p>
            </div>
          </a>

          {/* Email - Premium Card */}
          <a href="mailto:adv.umeshsurya@gmail.com" className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-600/30 hover:bg-white/10 transition-all duration-500 group">
            <div className="p-4 bg-white/10 text-yellow-500 rounded-xl group-hover:bg-yellow-600 group-hover:text-black transition-all">
              <FaEnvelope size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Official Email</p>
              <p className="font-bold text-white text-sm md:text-base truncate">adv.umeshsurya@gmail.com</p>
            </div>
          </a>

          {/* Education - Static Card */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="p-4 bg-white/10 text-yellow-500 rounded-xl">
              <FaGraduationCap size={20} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Qualifications</p>
              <p className="font-bold text-white text-base md:text-lg tracking-tight">B.Com, B.L.S., LL.B, LL.M</p>
            </div>
          </div>

          {/* Expertise - Static Card */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="p-4 bg-white/10 text-yellow-500 rounded-xl">
              <FaAward size={20} />
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Designation</p>
              <p className="font-bold text-white text-base md:text-lg tracking-tight">High Court Strategic Litigator</p>
            </div>
          </div>
        </div>

        {/* Location Info (Restored & Polished) */}
        <div className="flex items-center gap-3 text-gray-500 text-[10px] md:text-xs mt-4 tracking-[0.2em] font-black uppercase">
          <FaMapMarkerAlt className="text-yellow-600 animate-bounce" />
          <span>Office: M32, Dadlani Park CHS, Balkum, Thane (West)</span>
        </div>

        {/* SOCIAL LINKS & WHATSAPP (REFINED) */}
        <div className="flex flex-wrap gap-5 mt-4 items-center" data-aos="zoom-in">
          <div className="flex gap-4">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-500 group">
              <FaInstagram className="text-2xl text-gray-400 group-hover:text-pink-500 transition-colors" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-500 group">
              <FaFacebook className="text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
            </a>
          </div>

          <a
            href="https://wa.me/919225644200"
            target="_blank" rel="noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-4 px-10 py-5 bg-green-600 text-black rounded-full hover:bg-green-500 transition-all duration-500 shadow-[0_15px_30px_rgba(34,197,94,0.3)] active:scale-95 group"
          >
            <FaWhatsapp className="text-2xl group-hover:rotate-12 transition-transform" />
            <span className="font-black uppercase text-xs tracking-[0.3em]">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}