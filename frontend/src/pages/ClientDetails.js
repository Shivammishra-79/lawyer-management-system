import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import axios from "axios"; 
import logo from "../assets/logo.png"; 
import { 
  FaMapMarkerAlt, FaFileInvoiceDollar, 
  FaSave, FaEdit, FaPrint, FaTimes, FaRupeeSign, FaShieldAlt 
} from "react-icons/fa";

export default function ClientDetails({ currentApp, onClose }) {
  const advocateInfo = {
    name: "Adv. Umesh Suryawanshi",
    qualifications: "( B.Com, B.L.S., LL.B, LL.M )",
    designation: "ADVOCATE HIGH COURT",
    contact: "+91-9225644200",
    email: "adv.umeshsurya@gmail.com",
    address: "M32, Dadlani Park CHS, Dadlani Park, Balkum, Thane (W)"
  };

  const [client, setClient] = useState({ name: "", phone: "", address: "" });
  const [consultant, setConsultant] = useState({ problem: "", solution: "" });
  const [bill, setBill] = useState({ amount: "", gst: 18 });
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!currentApp) return;
    
    const savedClient = JSON.parse(localStorage.getItem("bill_" + currentApp.phone));
    const savedConsultant = JSON.parse(localStorage.getItem("consultant_" + currentApp.phone));

    setClient({
      name: currentApp.name || "",
      phone: currentApp.phone || "",
      address: currentApp.address || savedClient?.client?.address || ""
    });
    setConsultant({
      problem: currentApp.problem || savedConsultant?.problem || "",
      solution: currentApp.solution || savedConsultant?.solution || ""
    });
    setBill({
      amount: currentApp.fee || savedClient?.bill?.amount || "0",
      gst: currentApp.gst || savedClient?.bill?.gst || 18
    });

    const isAlreadySaved = Boolean(currentApp.fee || savedClient);
    setSaved(isAlreadySaved);
    setEditMode(!isAlreadySaved);
  }, [currentApp]);

  if (!currentApp) return null;

  const saveData = async () => {
    if (!client.address.trim() || !consultant.problem.trim() || !consultant.solution.trim()) {
      alert("⚠️ Mandatory Fields Missing: Please fill Address, Case Facts, and Legal Solution.");
      return;
    }

    const formData = new FormData();
    formData.append("address", client.address);
    formData.append("problem", consultant.problem);
    formData.append("solution", consultant.solution);
    formData.append("fee", bill.amount);
    formData.append("gst", bill.gst);

    try {
      await axios.put(`http://127.0.0.1:8000/appointments/${currentApp.id}/update`, formData);
      localStorage.setItem("bill_" + client.phone, JSON.stringify({ client, bill }));
      localStorage.setItem("consultant_" + client.phone, JSON.stringify(consultant));
      setSaved(true);
      setEditMode(false);
      alert("Legal Records Secured & Database Updated ✅");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Database Error: Could not save records ❌");
    }
  };

  const generatePDF = (type) => {
    const doc = new jsPDF();
    const isInvoice = type === "bill";
    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(0.8);
    doc.rect(5, 5, 200, 287); 
    doc.addImage(logo, 'PNG', 15, 12, 28, 28);
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "bold");
    doc.setFontSize(26);
    doc.text(advocateInfo.name.toUpperCase(), 110, 22, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(advocateInfo.qualifications, 110, 28, { align: "center" });
    doc.setFillColor(0, 0, 0);
    doc.rect(60, 33, 100, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(advocateInfo.designation, 110, 38.5, { align: "center" });
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.text(`Chamber: ${advocateInfo.address}`, 110, 47, { align: "center" });
    doc.text(`Contact: ${advocateInfo.contact} | Email: ${advocateInfo.email}`, 110, 52, { align: "center" });
    doc.setDrawColor(0);
    doc.line(15, 58, 195, 58);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    const title = isInvoice ? "FEE MEMORANDUM & TAX INVOICE" : "LEGAL OPINION & CASE ANALYSIS";
    doc.text(title, 105, 72, { align: "center" });
    doc.setFontSize(10);
    doc.text(`DATED: ${new Date().toLocaleDateString('en-GB')}`, 165, 80);
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 85, 180, 35, "F");
    doc.setDrawColor(200);
    doc.rect(15, 85, 180, 35);
    doc.setFont("times", "bold");
    doc.text("TO THE ATTENTION OF:", 20, 92);
    doc.setFontSize(14);
    doc.text(client.name.toUpperCase(), 20, 101);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(`Contact: +91 ${client.phone}`, 20, 108);
    doc.text(`Address: ${client.address}`, 20, 114, { maxWidth: 170 });

    if (isInvoice) {
      const amount = Number(bill.amount);
      const gstAmt = (amount * bill.gst) / 100;
      const total = amount + gstAmt;
      doc.setDrawColor(0);
      doc.setFillColor(235, 235, 235);
      doc.rect(15, 130, 180, 10, "F");
      doc.rect(15, 130, 180, 10);
      doc.setFont("times", "bold");
      doc.text("DESCRIPTION OF PROFESSIONAL SERVICES", 20, 136.5);
      doc.text("VALUE (INR)", 160, 136.5);
      doc.setFont("times", "normal");
      doc.rect(15, 140, 180, 55);
      doc.line(155, 140, 155, 195);
      doc.text("Legal Advice, Consultation, Drafting of Documentation,", 20, 152);
      doc.text("Procedural Representation and Case Management.", 20, 159);
      doc.text(amount.toLocaleString(), 160, 152);
      doc.setFont("times", "bold");
      doc.text(`Tax Component: GST @ ${bill.gst}%`, 20, 185);
      doc.text(gstAmt.toLocaleString(), 160, 185);
      doc.setFillColor(0, 0, 0);
      doc.rect(110, 205, 85, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.text(`NET TOTAL: Rs. ${total.toLocaleString()}/-`, 152.5, 213, { align: "center" });
    } else {
      doc.setTextColor(0, 0, 0);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("1. STATEMENT OF FACTS", 15, 135);
      doc.line(15, 137, 65, 137);
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.text(consultant.problem, 15, 145, { maxWidth: 180, align: "justify", lineHeightFactor: 1.5 });
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("2. LEGAL COUNSEL & ADVICE", 15, 195);
      doc.line(15, 197, 75, 197);
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.text(consultant.solution, 15, 203, { maxWidth: 180, align: "justify", lineHeightFactor: 1.5 });
    }
    const footerY = 265;
    doc.setDrawColor(220);
    doc.line(15, 250, 195, 250);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(advocateInfo.name, 135, footerY);
    doc.setFontSize(8.5);
    doc.setFont("times", "normal");
    doc.text("ADVOCATE HIGH COURT", 135, footerY + 5);
    doc.text("Digitally Authenticated Document", 135, footerY + 10);
    doc.save(`Legal_Document_${client.name.split(' ')[0]}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black z-[2000]">
      <div className="bg-[#0c0c0c] w-full h-screen flex flex-col shadow-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px] pointer-events-none"></div>

        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-zinc-900/10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border-4 border-amber-600/20 shadow-2xl">
              <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-black text-white tracking-widest">{advocateInfo.name.toUpperCase()}</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-amber-500 mt-2 flex items-center gap-2">
                <FaShieldAlt size={12} /> {advocateInfo.designation}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-5 bg-zinc-900 hover:bg-red-500 text-zinc-500 hover:text-white rounded-2xl transition-all duration-300">
            <FaTimes size={26} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5">
              <label className="text-[10px] text-zinc-600 font-black uppercase mb-4 block tracking-widest">Client Name</label>
              <p className="text-3xl font-serif font-bold text-white italic">{client.name}</p>
            </div>
            <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5">
              <label className="text-[10px] text-zinc-600 font-black uppercase mb-4 block tracking-widest">Contact Node</label>
              <p className="text-3xl font-mono font-bold text-white">+91 {client.phone}</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] text-amber-600 font-black uppercase ml-2 tracking-widest block">Client Address *</label>
              <div className="flex items-center bg-black border border-white/10 rounded-3xl px-6 h-24 focus-within:border-amber-600 transition-all">
                <FaMapMarkerAlt className="text-amber-600" />
                <input 
                  value={client.address}
                  onChange={e => setClient({...client, address: e.target.value})}
                  disabled={!editMode}
                  className="w-full p-6 bg-transparent text-zinc-200 outline-none text-lg"
                  placeholder="Address is mandatory..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[11px] text-amber-600 font-black uppercase ml-6 tracking-widest block italic">Factual Background *</label>
              <textarea 
                value={consultant.problem}
                onChange={e => setConsultant({...consultant, problem: e.target.value})}
                disabled={!editMode}
                className="w-full h-96 bg-zinc-900/20 border border-white/5 rounded-[3.5rem] p-12 text-zinc-300 outline-none focus:border-amber-600/40 transition-all resize-none text-lg shadow-inner"
                placeholder="Type details of the case..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] text-amber-600 font-black uppercase ml-6 tracking-widest block italic">Legal Counsel *</label>
              <textarea 
                value={consultant.solution}
                onChange={e => setConsultant({...consultant, solution: e.target.value})}
                disabled={!editMode}
                className="w-full h-96 bg-zinc-900/20 border border-white/5 rounded-[3.5rem] p-12 text-zinc-300 outline-none focus:border-amber-600/40 transition-all resize-none text-lg shadow-inner"
                placeholder="Type legal advice/conclusion..."
              />
            </div>
          </div>

          <div className="bg-[#050505] p-12 rounded-[4rem] flex flex-col lg:flex-row justify-between items-center border border-white/10 shadow-3xl">
            <div className="flex gap-10 flex-wrap justify-center">
              <div className="flex items-center bg-zinc-900/50 border-2 border-white/10 rounded-[2.5rem] px-10 h-28 focus-within:border-amber-600 transition-all">
                <FaRupeeSign className="text-amber-600 text-4xl" />
                <input 
                  type="number"
                  value={bill.amount}
                  onFocus={(e) => bill.amount === "0" && setBill({...bill, amount: ""})}
                  onChange={e => setBill({...bill, amount: e.target.value})}
                  disabled={!editMode}
                  className="bg-transparent p-6 text-5xl font-serif font-black text-white w-64 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="relative h-28">
                <select 
                  value={bill.gst}
                  onChange={e => setBill({...bill, gst: Number(e.target.value)})}
                  disabled={!editMode}
                  className="bg-zinc-900/50 border-2 border-white/10 p-8 rounded-[2.5rem] text-white font-black h-full outline-none appearance-none px-16 text-xl"
                >
                  {[0, 5, 12, 18, 28].map(v => (
                    <option key={v} value={v} className="bg-zinc-900">{v}% GST</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">▼</div>
              </div>
            </div>
            <div className="text-right mt-12 lg:mt-0">
              <p className="text-zinc-500 font-black mb-4 uppercase text-[12px] tracking-[0.4em]">Final Fee Valuation</p>
              <div className="text-9xl font-serif font-black text-white tracking-tighter leading-none flex items-end">
                <span className="text-amber-600 text-5xl mr-4 italic mb-2">₹</span>
                {(Number(bill.amount) + (bill.amount * bill.gst / 100)).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-black border-t border-white/10 flex justify-between items-center px-16">
          <div className="flex gap-8">
            <button onClick={() => generatePDF('record')} disabled={!saved} className="bg-white text-black px-14 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all disabled:opacity-20 flex items-center gap-4">
              <FaPrint className="text-xl" /> Print Record
            </button>
            <button onClick={() => generatePDF('bill')} disabled={!saved} className="bg-white text-black px-14 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all disabled:opacity-20 flex items-center gap-4">
              <FaFileInvoiceDollar className="text-xl" /> Fee Memo
            </button>
          </div>
          {editMode ? (
            <button onClick={saveData} className="bg-amber-600 text-black px-20 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-amber-500 transition-all flex items-center gap-4">
              <FaSave className="text-xl" /> Save & Lock
            </button>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-zinc-800 text-white px-20 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest border border-white/20 hover:bg-zinc-700 transition-all flex items-center gap-4">
              <FaEdit className="text-xl" /> Edit Records
            </button>
          )}
        </div>
      </div>
    </div>
  );
}