import { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaGavel, FaInstagram } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  // Professional Data from Business Card
  const advocateDetails = {
    name: "Adv. Umesh Suryawanshi",
    qualifications: "B.Com, B.L.S., LL.B, LL.M",
    phone: "+919225644200", // No dashes for tel link
    email: "adv.umeshsurya@gmail.com",
    address: "M32, Dadlani Park CHS, Dadlani Park, Balkum, Thane (W)",
    mapUrl: "https://www.google.com/maps/search/Dadlani+Park+CHS+Balkum+Thane" 
  };

  // Click Functions
  const makeCall = () => window.location.href = `tel:${advocateDetails.phone}`;
  const sendEmail = () => window.location.href = `mailto:${advocateDetails.email}`;
  const openMap = () => window.open(advocateDetails.mapUrl, "_blank");

  const handleSubmit = async () => {
    if (!name || !email || !phone || !subject) {
      alert("Please fill all required fields ❌");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("subject", subject);
    formData.append("message", message);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/contact", formData);
      alert(res.data.msg || "Message sent successfully ✅");
      setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
    } catch (err) {
      alert(err.response?.data?.detail || "Message sending failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 md:px-16 py-12 md:py-24 relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16" data-aos="zoom-in">
          <FaGavel className="text-yellow-600 text-4xl mx-auto mb-4" />
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 italic">Touch</span>
          </h1>
          <p className="text-gray-500 tracking-[0.3em] uppercase text-[10px] mt-4 font-bold">Advocate High Court</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Info Cards */}
          <div className="lg:col-span-4 space-y-8" data-aos="fade-right">
            <div className="bg-zinc-900/50 p-8 rounded-[30px] border border-white/10 backdrop-blur-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{advocateDetails.name}</h2>
              <p className="text-yellow-600 text-[10px] font-black tracking-widest uppercase mb-6 italic">{advocateDetails.qualifications}</p>
              
              <div className="space-y-6">
                {/* CALL FUNCTION */}
                <div onClick={makeCall} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all">
                  <div className="w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-all shadow-lg">
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Call Now</p>
                    <p className="font-bold text-lg text-white">+91 9225644200</p>
                  </div>
                </div>

                {/* EMAIL FUNCTION */}
                <div onClick={sendEmail} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all">
                  <div className="w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-all shadow-lg">
                    <FaEnvelope size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email Us</p>
                    <p className="text-gray-300 text-sm truncate font-medium">adv.umeshsurya@gmail.com</p>
                  </div>
                </div>

                {/* MAP FUNCTION */}
                <div onClick={openMap} className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all">
                  <div className="w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-black transition-all shadow-lg mt-1">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Office Location</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">M32, Dadlani Park, Thane</p>
                  </div>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="flex gap-4 mt-10">
                <a href="https://wa.me/919225644200" target="_blank" rel="noreferrer" className="flex-1 bg-green-600/20 text-green-500 py-4 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-xl">
                  <FaWhatsapp size={22} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex-1 bg-white/5 text-white py-4 rounded-2xl flex items-center justify-center hover:bg-yellow-600 hover:text-black transition-all shadow-xl">
                  <FaInstagram size={22} />
                </a>
              </div>
            </div>
          </div>

          {/* Form Section (No changes to logic) */}
          <div className="lg:col-span-8" data-aos="fade-left">
            <div className="bg-zinc-900/30 p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-yellow-600 outline-none transition-all text-white" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-yellow-600 outline-none transition-all text-white" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-yellow-600 outline-none transition-all text-white" />
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Legal Subject" className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 focus:border-yellow-600 outline-none transition-all text-white" />
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your legal matter..." className="w-full md:col-span-2 bg-black/50 border border-white/10 rounded-3xl py-4 px-6 min-h-[160px] outline-none focus:border-yellow-600 text-white" />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full mt-8 bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(180,130,0,0.3)] hover:scale-[1.01] active:scale-95 transition-all">
                {loading ? "Transmitting..." : "Send Secure Request"}
              </button>
            </div>
          </div>

          {/* Fully Interactive Big Map */}
          <div className="lg:col-span-12 mt-10" data-aos="fade-up">
            <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] h-[400px] md:h-[600px] group cursor-pointer" onClick={openMap}>
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.861789718442!2d72.9863483!3d19.2205556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b96695555555%3A0x0!2zMTnCsDEzJzE0LjAiTiA3MsKwNTknMTEuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
              <div className="absolute top-6 right-6 bg-yellow-600 text-black px-6 py-2 rounded-full font-black text-[10px] tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                CLICK TO OPEN MAPS
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}