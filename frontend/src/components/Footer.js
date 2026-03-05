import { NavLink } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaBalanceScale } from "react-icons/fa";
import logo from "../assets/logo.png"; // Logo import yahan hai

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] text-white mt-16 border-t-2 border-yellow-600/50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Decorative Gold Line Gradient */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* BRAND SECTION (Logo + Name) */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 group">
            <div className="relative w-16 md:w-20 transition-transform duration-700 group-hover:rotate-[360deg]">
               <img src={logo} alt="Adv. Umesh Suryawanshi Logo" className="w-full h-auto object-contain" />
               <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic leading-tight">
                Adv. Umesh <span className="text-yellow-500 block not-italic text-sm tracking-[0.3em] font-bold mt-1">Suryawanshi</span>
              </h2>
              <p className="text-[10px] font-bold text-yellow-600 tracking-[0.1em] uppercase mt-2">
                B.Com, B.L.S., LL.B, LL.M
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Advocate High Court. Premium legal services with trust, power, and results. Protecting your rights with elite courtroom strategy.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-yellow-600 pl-3 uppercase tracking-widest text-[13px]">
            Navigation
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {["Home", "About", "Services", "Blog", "Contact", "Appointment", "Login"].map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `text-sm tracking-wide transition-all duration-300 flex items-center gap-2 group ${
                      isActive ? "text-yellow-500 font-bold" : "text-gray-400 hover:text-white"
                    }`
                  }
                >
                  <span className="w-0 group-hover:w-4 h-[1px] bg-yellow-500 transition-all duration-300"></span>
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* OFFICE DETAILS (From Card) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-yellow-600 pl-3 uppercase tracking-widest text-[13px]">
            Office Details
          </h3>
          <div className="space-y-5">
            <a href="mailto:adv.umeshsurya@gmail.com" className="flex items-start gap-3 group">
              <FaEnvelope className="text-yellow-500 mt-1 transition-transform group-hover:scale-110" />
              <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">adv.umeshsurya@gmail.com</span>
            </a>
            <a href="tel:+919225644200" className="flex items-start gap-3 group">
              <FaPhoneAlt className="text-yellow-500 mt-1 transition-transform group-hover:scale-110" />
              <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">+91 92256 44200</span>
            </a>
            <div className="flex items-start gap-3 group">
              <FaMapMarkerAlt className="text-yellow-500 mt-1 shrink-0" />
              <span className="text-sm text-gray-400 leading-snug">
                M32, Dadlani Park CHS, Dadlani Park,<br />
                Balkum, Thane (W)
              </span>
            </div>
          </div>
        </div>

        {/* SOCIAL CONNECT */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-l-4 border-yellow-600 pl-3 uppercase tracking-widest text-[13px]">
              Connect
            </h3>
            <div className="flex gap-4">
              {[
                { icon: <FaInstagram />, color: "hover:bg-pink-600", link: "https://www.instagram.com/adv_umesh_suryawanshi/" },
                { icon: <FaFacebook />, color: "hover:bg-blue-700", link: "https://www.facebook.com/share/15Y68z8S6r/" },
                { icon: <FaWhatsapp />, color: "hover:bg-green-600", link: "https://wa.me/919225644200" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 transition-all duration-500 ${social.color} hover:text-white hover:-translate-y-2 shadow-lg`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
             <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-sm">
                <p className="text-[10px] text-yellow-500 uppercase font-black tracking-widest text-center">
                  Legal Excellence Since 2026
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BOTTOM */}
      <div className="bg-black py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] tracking-[0.2em] text-gray-500 uppercase font-bold">
          <p>© {currentYear} Adv. Umesh Suryawanshi | Developed by Shivam Mishra</p>
          <div className="flex gap-8">
            <span className="hover:text-yellow-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-yellow-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-yellow-500 cursor-pointer transition-colors">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}