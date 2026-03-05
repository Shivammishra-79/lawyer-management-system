import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp, FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' }); 
    setIsOpen(false); 
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setIsOpen(false);
  };

  const navLinks = ["Home", "About", "Services", "Blog", "Contact", "Login"];

  return (
    <>
      {/* --- Main Header --- */}
      <nav className="sticky top-0 z-[200] w-full backdrop-blur-3xl bg-black/90 border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 md:py-4 flex justify-between items-center">
          
          {/* Logo Section */}
          <Link to="/" onClick={handleScrollToTop} className="flex items-center gap-2 md:gap-4 shrink-0 relative z-[210] group">
            <div className="relative shrink-0">
              <div className="relative z-10 w-10 md:w-14 transition-transform duration-1000 group-hover:rotate-[360deg]">
                <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              </div>
              <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full animate-pulse"></div>
            </div>

            <div className="flex flex-col border-l border-yellow-600/30 pl-3 md:pl-5 py-1">
              <h1 className="font-black text-sm md:text-2xl text-white tracking-tighter leading-[1.1] uppercase italic">
                Adv. Umesh <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 text-[9px] md:text-[13px] tracking-[0.3em] md:tracking-[0.5em] not-italic font-black mt-1 block">
                  Suryawanshi
                </span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-10 flex-grow justify-center">
            <div className="flex items-center gap-8 font-bold uppercase text-[13px] tracking-[0.2em]">
              {navLinks.map((item) => (
                <NavLink 
                  key={item} 
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={handleScrollToTop}
                  className={({ isActive }) => 
                    `relative py-2 transition-all duration-500 hover:text-yellow-500 group ${isActive ? "text-yellow-500" : "text-gray-400"}`
                  }
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-500 transition-all duration-500 group-hover:w-full"></span>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-5 border-l border-white/10 pl-10 ml-2">
              <a href="https://www.instagram.com/adv_umesh_suryawanshi/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors"><FaInstagram size={18} /></a>
              <a href="https://www.facebook.com/share/15Y68z8S6r/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors"><FaFacebook size={18} /></a>
              <a href="https://wa.me/919225644200" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors"><FaWhatsapp size={18} /></a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0 relative z-[210]">
            <a href="tel:+919225644200" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-yellow-500 rounded-full hover:bg-yellow-600 hover:text-black hover:border-yellow-600 transition-all duration-500 group">
              <FaPhoneAlt size={10} className="group-hover:animate-bounce" />
              <span className="font-black uppercase text-[9px] tracking-[0.2em]">Quick Call</span>
            </a>

            <Link to="/appointment" onClick={handleScrollToTop} className="px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] hover:brightness-125 transition-all shadow-[0_5px_15px_rgba(202,138,4,0.3)] whitespace-nowrap rounded-sm">
              Book Session
            </Link>

            {/* Menu Toggle - Fixed Z-index and Design */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="xl:hidden flex items-center justify-center w-11 h-11 text-yellow-500 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all duration-300 hover:bg-yellow-600 hover:text-black shadow-lg"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu Overlay --- */}
      <div className={`fixed inset-0 w-full h-screen z-[150] xl:hidden transition-all duration-700 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Animated Background Layers */}
        <div className={`absolute inset-0 bg-black transition-all duration-700 ${isOpen ? "opacity-95" : "opacity-0"}`} onClick={() => setIsOpen(false)} />
        <div className={`absolute inset-0 bg-gradient-to-b from-yellow-900/20 to-transparent transition-all duration-1000 ${isOpen ? "translate-y-0" : "-translate-y-full"}`} />
        
        <div className="relative h-full flex flex-col items-center justify-center gap-8 px-6 overflow-hidden">
          {/* Background Text Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vh] font-black text-white/[0.02] uppercase pointer-events-none select-none whitespace-nowrap italic">
            Justice First
          </div>

          {navLinks.map((item, index) => (
            <Link 
              key={item} 
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={handleScrollToTop}
              className={`text-4xl md:text-5xl font-black uppercase tracking-tighter text-white hover:text-yellow-500 active:scale-90 transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              {item}
            </Link>
          ))}
          
          <div className={`w-20 h-[2px] bg-yellow-600 my-4 transition-all duration-1000 ${isOpen ? "w-24 opacity-100" : "w-0 opacity-0"}`}></div>
          
          {/* Mobile Socials */}
          <div className={`flex gap-6 transition-all duration-1000 delay-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <a href="https://www.instagram.com/adv_umesh_suryawanshi/" target="_blank" rel="noreferrer" className="text-yellow-500 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-yellow-600 hover:text-black transition-all"><FaInstagram size={22} /></a>
            <a href="https://www.facebook.com/share/15Y68z8S6r/" target="_blank" rel="noreferrer" className="text-yellow-500 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-yellow-600 hover:text-black transition-all"><FaFacebook size={22} /></a>
            <a href="https://wa.me/919225644200" target="_blank" rel="noreferrer" className="text-yellow-500 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-yellow-600 hover:text-black transition-all"><FaWhatsapp size={22} /></a>
          </div>

          <a href="tel:+919225644200" className={`flex items-center gap-3 px-10 py-4 bg-yellow-600 text-black rounded-full font-black uppercase text-xs tracking-[0.2em] mt-6 shadow-2xl transition-all duration-700 ${isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
             <FaPhoneAlt size={14} className="animate-pulse" /> Call for Consultation
          </a>
        </div>
      </div>
    </>
  );
}