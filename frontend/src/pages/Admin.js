import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClientDetails from "./ClientDetails";
import { 
  FaBalanceScale, FaCalendarAlt, FaSignOutAlt, 
  FaTrashAlt, FaPlus, FaNewspaper, FaConciergeBell, FaUserEdit,
  FaSearch, FaDownload, FaFilter, FaChevronDown, FaChevronUp 
} from "react-icons/fa";

// --- AUTOMATIC URL LOGIC ---
const BASE_URL = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:8000" 
  : "https://lawyer-management-system-8fwo.onrender.com";

export default function Admin() {
  const nav = useNavigate();
  
  const [activeTab, setActiveTab] = useState("appointments");
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [apps, setApps] = useState([]);
  
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [stitle, setSTitle] = useState("");
  const [sdesc, setSDesc] = useState("");
  const [cname, setCName] = useState("");
  const [cphone, setCPhone] = useState("");
  const [cdate, setCDate] = useState("");
  const [ctime, setCTime] = useState("");
  const [selectedDT, setSelectedDT] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [detailsModal, setDetailsModal] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [serviceCharges, setServiceCharges] = useState({});
  
  const [finSummary, setFinSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [expenses, setExpenses] = useState([]);
  const [exReason, setExReason] = useState("");
  const [exAmount, setExAmount] = useState("");
  const [incomeData, setIncomeData] = useState([]);
  const [clName, setClName] = useState("");
  const [clMobile, setClMobile] = useState("");
  const [clAmount, setClAmount] = useState("");
  const [clDate, setClDate] = useState(new Date().toISOString().split('T')[0]);
  const [exDate, setExDate] = useState(new Date().toISOString().split('T')[0]);

  const loadIncome = () => {
    const getDirectIncome = axios.get(`${BASE_URL}/get-income`);
    const getAppointments = axios.get(`${BASE_URL}/appointments`);

    Promise.all([getDirectIncome, getAppointments])
      .then(([resIncome, resAppts]) => {
        const manualData = resIncome.data.map(item => ({
          id: item.id,
          name: item.client_name,
          mobile: item.mobile_number,
          amount: item.amount,
          date: item.payment_date,
          source: "Direct"
        }));

        const apptData = resAppts.data
          .filter(a => a.status === "completed" && a.fee > 0)
          .map(a => ({
            id: a.id,
            name: a.name,
            mobile: a.phone,
            amount: a.total,
            date: a.date,
            source: "Appointment"
          }));

        const finalHistory = [...manualData, ...apptData].sort((a, b) => new Date(b.date) - new Date(a.date));
        setIncomeData(finalHistory);
      })
      .catch(err => console.error("Income History merge error:", err));
  };

  useEffect(() => {
    if (localStorage.getItem("admin") !== "yes") { nav("/login"); }
    load();
    loadFinance();
    loadIncome();
  }, []);

  const load = () => {
    axios.get(`${BASE_URL}/blogs`).then(r => setBlogs(r.data));
    axios.get(`${BASE_URL}/services`).then(r => setServices(r.data));
    axios.get(`${BASE_URL}/appointments`).then(r => setApps(r.data));
  };

  const loadFinance = () => {
    axios.get(`${BASE_URL}/finance-summary`).then(r => setFinSummary(r.data));
    axios.get(`${BASE_URL}/expenses`).then(r => setExpenses(r.data));
  };

  const filteredApps = useMemo(() => {
    return apps.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" ? true : a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, searchTerm, statusFilter]);

  const addExpense = () => {
    if (!exReason.trim() || !exAmount || !exDate) { alert("Please fill all fields ❌"); return; }
    if (Number(exAmount) <= 0) { alert("Amount must be greater than 0 ❌"); return; }
    const isConfirmed = window.confirm(`Confirm Expense Details:\n\n📅 Date: ${exDate}\n📝 Reason: ${exReason}\n💰 Amount: ₹${exAmount}`);
    if (isConfirmed) {
      const fd = new FormData();
      fd.append("reason", exReason);
      fd.append("amount", exAmount);
      fd.append("date", exDate);
      axios.post(`${BASE_URL}/add-expense`, fd)
        .then(() => {
          alert("Expense Added! ✅");
          setExReason(""); setExAmount("");
          setExDate(new Date().toISOString().split('T')[0]);
          loadFinance();
        }).catch(err => alert("Error adding expense ❌"));
    }
  };

  const delExpense = (id) => {
    if (window.confirm("Do you want to delete this expense?")) {
      axios.delete(`${BASE_URL}/delete-expense/${id}`).then(() => {
        alert("Expense Deleted! 🗑️");
        loadFinance();
      }).catch(err => alert("Error deleting expense ❌"));
    }
  };

  const addIncome = () => {
    if (!clName.trim() || !clAmount || !clDate) { alert("Please fill all fields ❌"); return; }
    const fd = new FormData();
    fd.append("name", clName);
    fd.append("mobile", clMobile);
    fd.append("amount", clAmount);
    fd.append("date", clDate);
    axios.post(`${BASE_URL}/add-income`, fd).then(() => {
      alert("Payment Recorded! ✅");
      setClName(""); setClMobile(""); setClAmount("");
      setClDate(new Date().toISOString().split('T')[0]);
      loadIncome(); loadFinance();
    }).catch(err => alert("Error recording income ❌"));
  };

  const delIncome = (id) => {
    if (window.confirm("Delete this income record?")) {
      axios.delete(`${BASE_URL}/delete-income/${id}`).then(() => {
        alert("Deleted! 🗑️");
        loadIncome(); loadFinance();
      }).catch(err => alert("Error ❌"));
    }
  };

  const addBlog = () => {
    if (!title.trim() || !content.trim()) { alert("Required ❌"); return; }
    const fd = new FormData();
    fd.append("title", title); fd.append("content", content);
    axios.post(`${BASE_URL}/add-blog`, fd).then(() => { alert("Blog Added ✅"); setTitle(""); setContent(""); load(); });
  };

  const delBlog = id => { axios.delete(`${BASE_URL}/delete-blog/${id}`).then(load); };

  const addService = () => {
    if (!stitle.trim() || !sdesc.trim()) { alert("Required ❌"); return; }
    const fd = new FormData();
    fd.append("title", stitle); fd.append("description", sdesc);
    axios.post(`${BASE_URL}/add-service`, fd).then(() => { alert("Service Added ✅"); setSTitle(""); setSDesc(""); load(); });
  };

  const delService = id => { axios.delete(`${BASE_URL}/delete-service/${id}`).then(load); };

  const completeAppointment = id => { 
    axios.put(`${BASE_URL}/appointments/${id}/complete`).then(() => {
        load(); loadFinance(); loadIncome();
    }); 
  };
  
  const deleteAppointment = id => { axios.delete(`${BASE_URL}/appointments/${id}`).then(load); };

  const offlineBook = async () => {
    if (!cname || !cphone || !cdate || !ctime) { alert("Please fill all fields ❌"); return; }
    const fd = new FormData();
    fd.append("name", cname); fd.append("phone", cphone); fd.append("date", cdate); fd.append("time", ctime);
    fd.append("address", ""); fd.append("problem", ""); fd.append("solution", "");
    fd.append("fee", 0); fd.append("gst", 18);
    try {
      const res = await axios.post(`${BASE_URL}/book`, fd);
      if (res.data.status === "fail") { alert(res.data.message); return; }
      alert("Appointment Booked ✅");
      setCName(""); setCPhone(""); setCDate(""); setCTime(""); setSelectedDT(null);
      load();
    } catch { alert("You Can't Select Prevoius Time ❌"); }
  };

  // ... (Baaki saara UI code same rahega)
  const filterDate = (date) => {
    const todayDate = new Date(); todayDate.setHours(0,0,0,0);
    return date >= todayDate && date.getDay() !== 0;
  };

  const showDetails = (app) => {
    setCurrentApp(app);
    const charges = {}; services.forEach(s => charges[s.id] = 0);
    setServiceCharges(charges); setDetailsModal(true);
  };

  const formatTime = (d) => d.toTimeString().slice(0,5);

  const normalizeTime = (time) => {
    if(!time) return null;
    if(time.includes(":") && time.length <= 5){
      let [h,m] = time.split(":");
      return `${h.padStart(2,"0")}:${m}`;
    }
    if(time.includes("AM") || time.includes("PM")){
      let [t,ampm] = time.split(" ");
      let [h,m] = t.split(":");
      h = parseInt(h);
      if(ampm==="PM" && h!==12) h+=12;
      if(ampm==="AM" && h===12) h=0;
      return `${h.toString().padStart(2,"0")}:${m}`;
    }
    return null;
  };

  useEffect(()=>{
    if(!cdate) return;
    const booked = apps.filter(a => a.date === cdate).map(a => normalizeTime(a.time)).filter(Boolean);
    setBookedTimes(booked);
  },[cdate, apps])

  const timeClassName = (time) => {
    const t = formatTime(time);
    if(bookedTimes.includes(t)) return "text-red-500 font-black";
    return "text-green-500 font-bold";
  };

  const exportIncome = () => {
    const csvRows = [["Date", "Client Name", "Mobile", "Source", "Amount"]];
    incomeData.forEach(inc => { csvRows.push([inc.date, inc.name, inc.mobile || "N/A", inc.source, inc.amount]); });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Income_${new Date().toLocaleDateString()}.csv`);
    link.click();
  };

  const exportExpenses = () => {
    const csvRows = [["Date", "Reason", "Amount"]];
    expenses.forEach(ex => { csvRows.push([ex.date, ex.reason, ex.amount]); });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Expense_${new Date().toLocaleDateString()}.csv`);
    link.click();
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-20 md:w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full z-50 shadow-2xl">
        <div className="p-8 flex items-center gap-4 border-b border-white/5 mb-6">
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <FaBalanceScale className="text-amber-500 text-2xl" />
          </div>
          <h1 className="hidden md:block text-xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Justice <span className="text-amber-500">Portal</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem active={activeTab === "appointments"} icon={<FaCalendarAlt/>} label="Appointments" onClick={() => setActiveTab("appointments")} />
          <NavItem active={activeTab === "offline"} icon={<FaUserEdit/>} label="Offline Entry" onClick={() => setActiveTab("offline")} />
          <NavItem active={activeTab === "finance"} icon={<FaBalanceScale/>} label="Ledger & Books" onClick={() => { setActiveTab("finance"); loadFinance(); loadIncome();}} />
          <NavItem active={activeTab === "services"} icon={<FaConciergeBell/>} label="Our Services" onClick={() => setActiveTab("services")} />
          <NavItem active={activeTab === "blogs"} icon={<FaNewspaper/>} label="Law Blogs" onClick={() => setActiveTab("blogs")} />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => {localStorage.removeItem("admin"); nav("/login");}} className="flex items-center gap-3 w-full p-4 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold group">
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden md:block text-xs uppercase tracking-widest">Logout System</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-radial-at-t from-zinc-900/20 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto">
        {/* APPOINTMENTS SECTION */}
{activeTab === "appointments" && (
  <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-1">Active <span className="text-amber-500 underline decoration-white/10">Sessions</span></h2>
        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Live client management panel</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-72">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs"/>
          <input 
            placeholder="Find client name or phone..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-zinc-900/50 border border-white/10 pl-10 pr-4 py-3.5 rounded-2xl text-xs outline-none focus:border-amber-500/50 transition-all focus:bg-zinc-900"
          />
        </div>
        
        {/* Counts inside the Select Dropdown */}
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="bg-zinc-900/50 border border-white/10 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase outline-none cursor-pointer hover:bg-zinc-900 transition-all text-amber-500"
        >
          <option value="all">All ({apps.length})</option>
          <option value="pending">Pending ({apps.filter(a => a.status !== 'completed').length})</option>
          <option value="completed">Completed ({apps.filter(a => a.status === 'completed').length})</option>
        </select>
      </div>
    </div>

    {/* APPOINTMENTS LIST */}
    <div className="grid gap-4">
      {filteredApps.length > 0 ? filteredApps.map(a => (
        <div key={a.id} className="group bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-white/5 p-7 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:border-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${a.status === 'completed' ? 'bg-green-500 shadow-green-500/50' : 'bg-amber-500 shadow-amber-500/50 animate-pulse'}`}></span>
              <h3 className="font-black text-2xl tracking-tighter text-white/90">{a.name}</h3>
            </div>
            <div className="flex flex-wrap gap-5 text-xs font-bold text-zinc-500 uppercase">
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">📞 {a.phone}</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">📅 {a.date}</span>
              <span className="text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg font-black tracking-widest">⏰ {a.time}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {a.status !== "completed" && (
              <button 
                onClick={() => window.confirm("Mark Complete?") && completeAppointment(a.id)} 
                className="flex-1 md:flex-none bg-green-600/90 text-white px-7 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-green-500 shadow-lg shadow-green-600/20 transition-all active:scale-95"
              >
                Done
              </button>
            )}
            <button 
              onClick={() => window.confirm("Delete Case?") && deleteAppointment(a.id)} 
              className="p-3.5 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              <FaTrashAlt/>
            </button>
            <button 
              onClick={() => showDetails(a)} 
              className="flex-1 md:flex-none bg-zinc-100 text-black px-7 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-amber-500 transition-all shadow-lg active:scale-95"
            >
              Case View
            </button>
          </div>
        </div>
      )) : (
        <div className="text-center py-32 text-zinc-700 font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[3rem]">
          No records matching your search
        </div>
      )}
    </div>
  </section>
)}
          {/* OFFLINE BOOKING */}
          {activeTab === "offline" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Manual <span className="text-amber-500">Record</span></h2>
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-12">Register a walk-in client session</p>
              <div className="bg-gradient-to-br from-zinc-900/40 to-black p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-3xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase text-amber-500/70 font-black ml-1 tracking-widest">Client Name</label>
                    <input placeholder="Enter full name..." value={cname} onChange={e => setCName(e.target.value.replace(/[^A-Za-z\s]/g,""))} className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-600/50 transition-all text-sm font-bold shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase text-amber-500/70 font-black ml-1 tracking-widest">Contact Phone</label>
                    <input placeholder="10 digit number..." value={cphone} onChange={e => { const val = e.target.value.replace(/\D/g,""); if(val.length<=10) setCPhone(val); }} className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-600/50 transition-all text-sm font-bold shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase text-amber-500/70 font-black ml-1 tracking-widest">Schedule Slot</label>
                    <DatePicker
                      selected={selectedDT}
                      onChange={(d)=>{ setSelectedDT(d); setCDate(d.toISOString().split("T")[0]); setCTime(d.toTimeString().slice(0,5)); }}
                      showTimeSelect timeFormat="hh:mm aa" timeIntervals={30} filterDate={filterDate}
                      minTime={new Date(0,0,0,10,0)} maxTime={new Date(0,0,0,18,0)}
                      placeholderText="Select Date & Time"
                      className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none text-sm font-bold shadow-inner cursor-pointer"
                      timeClassName={timeClassName} minDate={new Date()}
                      dateFormat="MMMM d, yyyy - h:mm aa"
                    />
                  </div>
                </div>
                <button onClick={offlineBook} className="w-full mt-12 bg-amber-600 text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-500 hover:scale-[1.01] transition-all shadow-xl shadow-amber-600/20 active:scale-95">Register Appointment</button>
              </div>
            </section>
          )}
{/* FINANCE & LEDGER SECTION */}
{activeTab === "finance" && (
  <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-1">Financial <span className="text-amber-500 underline decoration-white/10">Ledger</span></h2>
        <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Manage cashflow and settlements</p>
      </div>
      {/* Export buttons yahan se hata diye gaye hain */}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div 
        onClick={() => setActiveTab("income_details")}
        className="cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-green-500/30 transition-all shadow-2xl"
      >
        <div className="absolute -right-4 -top-4 text-green-500/5 text-8xl rotate-12 group-hover:rotate-0 transition-all"><FaPlus/></div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-3 group-hover:text-green-500 transition-colors underline underline-offset-4">View All Inflow →</p>
        <h3 className="text-4xl font-black text-green-500 tracking-tighter">₹{finSummary.income.toLocaleString()}</h3>
      </div>

      <div 
        onClick={() => setActiveTab("expense_details")}
        className="cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-950 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-all shadow-2xl"
      >
        <div className="absolute -right-4 -top-4 text-red-500/5 text-8xl rotate-12 group-hover:rotate-0 transition-all"><FaTrashAlt/></div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-3 group-hover:text-red-500 transition-colors underline underline-offset-4">View All Outflow →</p>
        <h3 className="text-4xl font-black text-red-500 tracking-tighter">₹{finSummary.expense.toLocaleString()}</h3>
      </div>

      <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-amber-600/20 group">
         <div className="absolute -right-4 -top-4 text-white/10 text-8xl rotate-12 group-hover:rotate-0 transition-all"><FaBalanceScale/></div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-black font-black mb-3 opacity-60">Net Profit</p>
        <h3 className="text-4xl font-black text-black tracking-tighter">₹{finSummary.balance.toLocaleString()}</h3>
      </div>
    </div>

    {/* Forms */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="bg-zinc-900/30 p-10 rounded-[3rem] border border-green-500/10">
        <h4 className="font-black text-xs uppercase tracking-widest text-green-500 mb-8 flex items-center gap-3"><span className="w-8 h-[2px] bg-green-500/30"></span> Add Income</h4>
        <div className="space-y-5">
          <input placeholder="Client Full Name" value={clName} onChange={e => setClName(e.target.value.replace(/[^A-Za-z\s]/g, ""))} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-green-600/50 text-sm font-bold" />
          <input placeholder="Mobile Number" value={clMobile} onChange={e => setClMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-green-600/50 text-sm font-bold" />
          <div className="grid grid-cols-2 gap-5">
            <input type="number" placeholder="Amt (₹)" value={clAmount} onChange={e => setClAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-green-600/50 text-sm font-bold" />
            <input type="date" value={clDate} onChange={e => setClDate(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none text-zinc-500 text-xs font-bold uppercase" />
          </div>
          <button onClick={addIncome} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 transition-all shadow-xl shadow-green-600/10">Submit Income</button>
        </div>
      </div>

      <div className="bg-zinc-900/30 p-10 rounded-[3rem] border border-red-500/10">
        <h4 className="font-black text-xs uppercase tracking-widest text-red-500 mb-8 flex items-center gap-3"><span className="w-8 h-[2px] bg-red-500/30"></span> Record Expense</h4>
        <div className="space-y-5">
          <input placeholder="Expense Reason" value={exReason} onChange={e => setExReason(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-red-600/50 text-sm font-bold" />
          <div className="grid grid-cols-2 gap-5">
            <input type="number" placeholder="Amt (₹)" value={exAmount} onChange={e => setExAmount(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-red-600/50 text-sm font-bold" />
            <input type="date" value={exDate} onChange={e => setExDate(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none text-zinc-500 text-xs font-bold uppercase" />
          </div>
          <button onClick={addExpense} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-600/10">Submit Expense</button>
        </div>
      </div>
    </div>
  </section>
)}

{/* DETAIL VIEW: INCOME */}
{activeTab === "income_details" && (
  <section className="animate-in zoom-in-95 duration-500">
    <button onClick={() => setActiveTab("finance")} className="mb-8 text-amber-500 font-black uppercase text-xs flex items-center gap-2 hover:underline">← Back to Ledger</button>
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-4xl font-black uppercase italic tracking-tighter">Inflow <span className="text-green-500">History</span></h2>
      {/* CSV Export Button ab yahan hai */}
      <button onClick={exportIncome} className="bg-green-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"><FaDownload/> Export CSV</button>
    </div>
    <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-white/5">
          <tr>
            <th className="p-8">Client Name</th>
            <th className="p-8">Source</th>
            <th className="p-8">Contact</th>
            <th className="p-8">Date</th>
            <th className="p-8 text-right">Amount</th>
            <th className="p-8 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-bold">
          {incomeData.map((inc, i) => (
            <tr key={i} className="hover:bg-white/5 transition-all group">
              <td className="p-8 text-white">{inc.name}</td>
              <td className="p-8">
                <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-black ${inc.source === 'Appointment' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                  {inc.source}
                </span>
              </td>
              <td className="p-8 text-zinc-500 text-xs tracking-widest">{inc.mobile || "N/A"}</td>
              <td className="p-8 text-zinc-600 text-xs uppercase">{inc.date}</td>
              <td className="p-8 text-right font-black text-green-500 text-xl">₹{Number(inc.amount).toLocaleString()}</td>
              <td className="p-8 text-center">
                {/* Sirf Direct source ke liye delete button dikhega */}
                {inc.source === "Direct" && (
                  <button onClick={() => delIncome(inc.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">
                    <FaTrashAlt size={14}/>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}

{/* DETAIL VIEW: EXPENSE */}
{activeTab === "expense_details" && (
  <section className="animate-in zoom-in-95 duration-500">
    <button onClick={() => setActiveTab("finance")} className="mb-8 text-amber-500 font-black uppercase text-xs flex items-center gap-2 hover:underline">← Back to Ledger</button>
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-4xl font-black uppercase italic tracking-tighter">Expense <span className="text-red-500">Logs</span></h2>
      {/* CSV Export Button ab yahan hai */}
      <button onClick={exportExpenses} className="bg-red-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"><FaDownload/> Export CSV</button>
    </div>
    <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-white/5">
          <tr>
            <th className="p-8">Reason</th>
            <th className="p-8">Date</th>
            <th className="p-8 text-right">Amount</th>
            <th className="p-8 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-bold text-sm">
          {expenses.map((ex, i) => (
            <tr key={i} className="hover:bg-white/5 transition-all">
              <td className="p-8 text-white">{ex.reason}</td>
              <td className="p-8 text-zinc-600 text-xs uppercase">{ex.date}</td>
              <td className="p-8 text-right font-black text-red-500 text-xl font-sans">₹{Number(ex.amount).toLocaleString()}</td>
              <td className="p-8 text-center">
                <button onClick={() => delExpense(ex.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">
                  <FaTrashAlt size={14}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}
          {/* SERVICES */}
          {activeTab === "services" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Legal <span className="text-amber-500">Practice</span></h2>
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-12">Manage service offerings</p>
              <div className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 mb-10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input placeholder="Service Title (e.g. Civil Case)" value={stitle} onChange={e => setSTitle(e.target.value)} className="bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-600/50 text-sm font-bold" />
                  <input placeholder="Brief description of service..." value={sdesc} onChange={e => setSDesc(e.target.value)} className="bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-600/50 text-sm font-bold" />
                </div>
                <button onClick={addService} className="w-full mt-6 bg-zinc-100 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95">Add Service to Portfolio</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between hover:border-amber-500/20 group transition-all">
                    <div>
                      <h3 className="font-black text-amber-500 mb-3 tracking-tighter text-xl uppercase italic group-hover:translate-x-1 transition-transform">{s.title}</h3>
                      <p className="text-xs text-zinc-500 font-bold leading-relaxed">{s.description}</p>
                    </div>
                    <button onClick={() => delService(s.id)} className="mt-8 text-zinc-700 hover:text-red-500 self-end transition-colors"><FaTrashAlt size={18} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BLOGS */}
          {activeTab === "blogs" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Legal <span className="text-amber-500">Blog</span></h2>
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-12">Publish articles & news</p>
              <div className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 mb-12 shadow-2xl">
                <div className="space-y-6">
                  <input placeholder="Catchy Article Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-600/50 text-sm font-bold" />
                  <textarea placeholder="Share your legal insights here..." rows="5" value={content} onChange={e => setContent(e.target.value)} className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl outline-none focus:border-amber-600/50 text-sm font-bold resize-none" />
                  <button onClick={addBlog} className="w-full bg-amber-600 text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95">Publish Article Now</button>
                </div>
              </div>
              <div className="grid gap-6">
                {blogs.map(b => (
                  <div key={b.id} className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center group hover:bg-zinc-900/40 transition-all">
                    <div className="truncate flex-1 pr-12">
                      <h3 className="font-black text-amber-500 text-xl truncate mb-2 uppercase italic tracking-tighter group-hover:text-white transition-colors">{b.title}</h3>
                      <p className="text-xs text-zinc-600 font-bold truncate tracking-widest">{b.content}</p>
                    </div>
                    <button onClick={() => delBlog(b.id)} className="text-zinc-700 hover:text-red-500 transition-colors"><FaTrashAlt size={20} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* MODAL */}
      {detailsModal && (
        <ClientDetails
          currentApp={currentApp}
          onClose={() => {
            setDetailsModal(false);
            load(); loadFinance(); loadIncome();
          }}
        />
      )}
      
      {/* GLOBAL STYLES FOR SCROLLBAR */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fbbf24; }
      `}</style>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-500 group ${active ? "bg-amber-600 text-black shadow-2xl shadow-amber-600/30 font-black scale-[1.02]" : "text-zinc-500 hover:bg-white/5 hover:text-white font-bold"}`}>
      <span className={`text-xl transition-transform duration-500 ${active ? "scale-110" : "group-hover:scale-110"}`}>{icon}</span>
      <span className="hidden md:block text-[10px] uppercase tracking-[0.15em]">{label}</span>
    </button>
  );
}