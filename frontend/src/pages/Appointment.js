import axios from "axios";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import lawyerImg from "../assets/lawyer.jpg";
import { FaUser, FaPhoneAlt, FaCalendarAlt, FaClock, FaGavel, FaCheckCircle, FaFileDownload } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

// --- AUTOMATIC URL LOGIC ---
const BASE_URL = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:8000" 
  : "https://lawyer-management-system-8fwo.onrender.com";

// --- SKELETON COMPONENT FOR PREMIUM FEEL ---
const SlotSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
      <div key={i} className="h-14 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
    ))}
  </div>
);

export default function Appointment() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // --- FETCH LOGIC WITH SMART CACHING ---
  const fetchBooked = async (d) => {
    const cacheKey = `booked_${d}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    // Pehle purana data dikhao (Instant)
    if (cachedData) {
      setBookedTimes(JSON.parse(cachedData));
    } else {
      setIsSlotsLoading(true);
    }

    try {
      const res = await axios.get(`${BASE_URL}/appointments`);
      const sameDay = res.data.filter(a => a.date === d);
      const times = sameDay.map(a => {
        const [t, ampm] = a.time.split(" ");
        if (!ampm) return a.time;
        let [h, m] = t.split(":");
        h = parseInt(h);
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return `${h.toString().padStart(2, "0")}:${m}`;
      });
      
      // Update data and refresh cache
      setBookedTimes(times);
      localStorage.setItem(cacheKey, JSON.stringify(times));
    } catch (err) { 
      console.error("Error fetching slots", err); 
    } finally {
      setIsSlotsLoading(false);
    }
  };

  // --- KHATARNAK PDF SLIP DESIGN ---
  const downloadSlip = () => {
    const doc = new jsPDF();
    const goldColor = [202, 138, 4]; // #ca8a04
    
    doc.setDrawColor(202, 138, 4);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 287);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, 196, 283);

    doc.setFillColor(5, 5, 5);
    doc.rect(7, 7, 196, 45, "F");

    try { doc.addImage(lawyerImg, "JPEG", 15, 12, 35, 35); } catch (e) { }

    doc.setTextColor(202, 138, 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("ADV. UMESH SURYAWANSHI", 55, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text("(B.Com, B.L.S., LL.B, LL.M | ADVOCATE HIGH COURT)", 190, 32, { align: "right" });
    doc.setDrawColor(202, 138, 4);
    doc.setLineWidth(0.5);
    doc.line(55, 36, 190, 36);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("OFFICIAL CONSULTATION SLIP", 105, 70, { align: "center" });
    
    doc.setFontSize(9); doc.setTextColor(100);

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, 90, 180, 55, 3, 3, "F");
    
    doc.setFontSize(12); doc.setTextColor(202, 138, 4);
    doc.text("APPOINTMENT SUMMARY", 25, 100);
    doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal");
    doc.text(`Client Name     :   ${name.toUpperCase()}`, 30, 112);
    doc.text(`Contact No      :   +91 ${phone}`, 30, 120);
    doc.text(`Scheduled Date :   ${date}`, 30, 128);
    doc.text(`Scheduled Time :   ${to12Hour(time)}`, 30, 136);

    doc.setDrawColor(202, 138, 4); doc.rect(15, 160, 180, 35);
    doc.setFont("helvetica", "bold"); doc.text("OFFICE LOCATION:", 20, 170);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text("M32, Dadlani Park CHS, Balkum Road, Thane West, MH - 400608", 20, 178);

    doc.setFontSize(9); doc.setTextColor(100);
    doc.text("Note: Please carry this slip (Digital/Print) and reach 10 mins early.", 105, 240, { align: "center" });

    doc.setFillColor(5, 5, 5); doc.rect(7, 270, 196, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Contact: +91 9225644200 | Email: adv.umeshsurya@gmail.com", 105, 282, { align: "center" });

    doc.save(`Appointment_${name.replace(/\s+/g, '_')}.pdf`);
  };

  // --- BOOK LOGIC ---
  const book = async () => {
    if (!name || !phone || !date || !time) { alert("Fill all fields"); return; }
    if (phone.length !== 10 || !/^\d+$/.test(phone)) { alert("Phone must be 10 digits"); return; }
    const fd = new FormData();
    fd.append("name", name); fd.append("phone", phone); fd.append("date", date); fd.append("time", time);
    try {
      const res = await axios.post(`${BASE_URL}/book`, fd);
      if (res.data.status === "fail") { alert(res.data.message || "Slot already booked"); return; }
      alert("Booked Successfully ✅");
      
      // Clear cache for updated day
      localStorage.removeItem(`booked_${date}`);
      
      downloadSlip();
      setName(""); setPhone(""); setDate(""); setTime(""); setSelectedDate(null);
    } catch (err) { alert(err.response?.data?.detail || "Booking Failed"); }
  };

  // --- HELPERS (Poora 280+ Lines karne ke liye) ---
  const isPastTime = (slotTime) => {
    if (!date) return false;
    const now = new Date();
    const selected = new Date(date);
    if (selected.toDateString() !== now.toDateString()) return false;
    const [h, m] = slotTime.split(":");
    const slotDateTime = new Date();
    slotDateTime.setHours(parseInt(h)); slotDateTime.setMinutes(parseInt(m)); slotDateTime.setSeconds(0);
    return slotDateTime <= now;
  };

  const to12Hour = (time) => {
    if (!time) return "";
    let [h, m] = time.split(":");
    h = parseInt(h);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 10; h <= 18; h++) {
      if (h === 18) { slots.push("18:00"); break; }
      slots.push(`${h}:00`); slots.push(`${h}:30`);
    }
    return slots.map(t => {
      let [h, m] = t.split(":");
      h = parseInt(h);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return { label: `${h12}:${m} ${ampm}`, value: `${h.toString().padStart(2, "0")}:${m}` };
    });
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 md:px-16 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12" data-aos="zoom-in">
          <FaGavel className="text-yellow-600 text-3xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600 italic">Booking</span>
          </h1>
          <p className="text-gray-500 font-bold text-[10px] tracking-[0.4em] mt-4 uppercase">Secure your consultation</p>
        </div>

        <div className="bg-zinc-900/20 border border-white/5 rounded-[40px] p-6 md:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left: Input Details */}
            <div className="space-y-6" data-aos="fade-right">
              <div className="bg-black/40 border border-white/5 p-8 rounded-[30px] space-y-6">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600/50" />
                  <input
                    placeholder="Full Name"
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-4 pl-12 outline-none focus:border-yellow-600 transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 border-b border-white/10 py-4 relative">
                  <FaPhoneAlt className="text-yellow-600/50 ml-1" />
                  <span className="text-gray-500 font-bold">+91</span>
                  <input
                    placeholder="Contact Number"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setPhone(val);
                    }}
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </div>

              <div className="premium-datepicker bg-black/40 p-4 rounded-[30px] border border-white/5 flex justify-center">
                <DatePicker
                  selected={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    const dd = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
                    setDate(dd); setTime(""); fetchBooked(dd);
                  }}
                  filterDate={(d) => d.getDay() !== 0}
                  minDate={new Date()}
                  inline
                />
              </div>
            </div>

            {/* Right: Time Slots & Summary */}
            <div className="flex flex-col h-full" data-aos="fade-left">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest text-yellow-600">
                  <FaClock /> Available Slots
                </h3>
                {date && <span className="bg-yellow-600/10 text-yellow-500 px-4 py-1 rounded-full text-[10px] font-black">{date}</span>}
              </div>

              <div className="overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                {!date ? (
                  <p className="text-zinc-600 text-center py-10 font-bold italic">Select a date to view availability</p>
                ) : isSlotsLoading ? (
                  <SlotSkeleton />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(t => {
                      const isBooked = bookedTimes.includes(t.value);
                      const past = isPastTime(t.value);
                      const isSelected = time === t.value;

                      return (
                        <button
                          key={t.value}
                          disabled={isBooked || past}
                          onClick={() => setTime(t.value)}
                          className={`p-4 rounded-2xl text-[10px] font-black transition-all border
                            ${isBooked ? "bg-red-900/20 border-red-900/30 text-red-800 cursor-not-allowed opacity-40" :
                              past ? "bg-zinc-800 border-zinc-700 text-zinc-600 opacity-30" :
                              isSelected ? "bg-yellow-600 border-yellow-400 text-black scale-105" :
                              "bg-white/5 border-white/10 text-gray-400 hover:border-yellow-600 hover:text-white"}`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <div className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${date && time ? 'bg-yellow-600/10 border-yellow-600/40' : 'bg-white/5 border-white/5 opacity-30'}`}>
                  <div>
                    <p className="text-[10px] font-black uppercase text-yellow-600 tracking-widest">Selected Slot</p>
                    <p className="text-sm font-bold">{date || 'Select Date'} {time && ` @ ${to12Hour(time)}`}</p>
                  </div>
                  {date && time && <FaCheckCircle className="text-yellow-600 text-xl animate-pulse" />}
                </div>

                <button
                  onClick={book}
                  className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <FaFileDownload className="inline mr-2 mb-1" /> Confirm & Get Slip
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx="true">{`
        .premium-datepicker .react-datepicker { background: transparent !important; border: none !important; color: white !important; }
        .premium-datepicker .react-datepicker__header { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .premium-datepicker .react-datepicker__current-month, .premium-datepicker .react-datepicker__day-name, .premium-datepicker .react-datepicker__day { color: white !important; }
        .premium-datepicker .react-datepicker__day--selected { background: #ca8a04 !important; border-radius: 12px !important; color: black !important; font-weight: 900 !important; }
        .premium-datepicker .react-datepicker__day--disabled { color: #222 !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ca8a04; border-radius: 10px; }
      `}</style>
    </div>
  );
}