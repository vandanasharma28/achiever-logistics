import './App.css';
import { useState, useEffect, useRef } from 'react';
import truckImg from './truck.png';

// ⚠️ Change this to your live backend URL once you deploy it.
const API_BASE = 'http://localhost:8080';

// ---------- Real company details (from official visiting card) ----------
const COMPANY_FULL = 'Achiever Logistics Cargo Private Limited';
const COMPANY_TAGLINE = 'Fleet Owners & Transport Contractors';
const DIRECTOR_NAME = 'Mr. Dinesh Kumar';
const DIRECTOR_TITLE = 'Director';
const PRIMARY_PHONE = '9112020105'; // Director's mobile - used for calls / WhatsApp
const OFFICE_PHONES = ['011-45684179', '9582220782', '9319607878'];
const PRIMARY_EMAIL = 'Dineshsharma.alcpl@gmail.Com';
const DIRECTOR_EMAIL = 'Dineshsharma.alcpl@gmail.Com';
const WEBSITE = '500+ Businesses Trust Us Pan India';
const ADMIN_OFFICE_ADDR = 'HR-72/4, Ground Floor, Nr. Raj Medical Center, Pul Prahladpur, New Delhi - 110044';
const REGISTERED_OFFICE_ADDR = '2826, First Floor, Sector 49, Sainik Colony, Faridabad, Haryana - 121001';

// ---------- Small reusable: animated counter (DHL/VRL style stat counters) ----------
function Counter({ end, suffix = '', duration = 1600 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setValue(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
            else setValue(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return (
    <div className="counter-box" ref={ref}>
      <div className="counter-num">
        {value}
        {suffix}
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState('home');
  const [showQuote, setShowQuote] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Which branch's full detail page is open (null = none open)
  const [branchView, setBranchView] = useState(null);

  const testimonials = [
    {
      name: 'Rohit Malhotra',
      company: 'Malhotra Auto Parts, Pune',
      text: 'Achiever Logistics ne humara Delhi-Pune route bilkul tension-free bana diya hai. Har delivery time pe hoti hai.',
    },
    {
      name: 'Sneha Kulkarni',
      company: 'Kulkarni Electronics, Mumbai',
      text: 'GPS tracking aur unka support team dono hi bahut reliable hain. 2 saal se inke saath kaam kar rahe hain.',
    },
    {
      name: 'Amit Verma',
      company: 'Verma Steels, Pimpri',
      text: 'Heavy machinery transport ke liye best choice. Kabhi damage ya delay ki complaint nahi aayi.',
    },
  ];

  // Achiever Logistics - Branch Network - Professional English Version - Unique Content
const branches = [
  {
    city: 'New Delhi', tag: 'Admin Office', type: 'ADMIN OFFICE - HEADQUARTERS',
    addr: ADMIN_OFFICE_ADDR, lat: 28.5136, lng: 77.3112, icon: '🏢',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Corporate Head Office', coverage: 'Delhi, South Delhi, Okhla, Badarpur - Pan India Control',
    desc: 'New Delhi is the Corporate Headquarters of Achiever Logistics Cargo Private Limited, controlling Pan India operations and planning.',
    long1: 'New Delhi branch at Okhla Industrial Area is the strategic command center for Pan India logistics. Managing 100+ daily truck movements, this office handles corporate clients, billing, and customer support. Specialized in Delhi to Pune, Mumbai, Ahmedabad, Chennai, Bangalore daily express with owned fleet.',
    long2: 'Delhi Advantage: Direct access to Delhi-Mumbai Expressway, NH-48 and Eastern Peripheral. Offers same-day pickup from Okhla, Naraina, Mundka, Azadpur and Alipur. Special reefer vans for pharma and e-commerce bulk movement with palletized loading.',
    industries: 'E-commerce, Retail, Pharma, FMCG', routes: 'Delhi to Pune, Mumbai, Ahmedabad, Bangalore, Chennai', speciality: 'Corporate Control & Pan India Dispatch',
    services: ['Corporate Headquarters - Pan India Control', 'Delhi to Pune Daily Express', 'Okhla to South India Service', 'Reefer Van for Pharma', 'E-commerce Bulk Movement', 'ICD Tughlakabad Container Transport']
  },
  {
    city: 'Faridabad', tag: 'Registered Office', type: 'REGISTERED OFFICE - LEGAL ENTITY',
    addr: REGISTERED_OFFICE_ADDR, lat: 28.3670, lng: 77.3150, icon: '🏭',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Legal & Billing Office', coverage: 'Haryana, Punjab, Rajasthan, Delhi NCR',
    desc: 'Faridabad is our Registered Office handling legal compliance, GST billing and Haryana industrial belt operations.',
    long1: 'Faridabad branch in Sector-24 is the backbone for Haryana industrial belt - Ballabgarh, Sector 58-59, Palwal. Expert in steel coil, sheet metal and heavy engineering transport with specialized coil trailers and low-bed trailers for JCB, Escorts and other OEMs. 10+ years in Faridabad region.',
    long2: 'Faridabad Edge: Near Delhi-Mumbai Expressway for fastest transit to Maharashtra and Gujarat. Offers 24/7 loading for urgent factory dispatches, steel coil transport with anti-rust packaging, and heavy machinery shifting with hydraulic low-beds.',
    industries: 'Steel, Auto Ancillary, Heavy Engineering', routes: 'Faridabad to Pune, Chennai, Coimbatore, Hosur, Bangalore', speciality: 'Steel Coil & Heavy Machinery',
    services: ['Ballabgarh Industrial Transport', 'ODC Heavy Machinery Shifting', 'Faridabad to South India Daily', 'Steel Coil & Sheet Metal', 'Palletized Engineering Goods', 'Daily Faridabad to Pune']
  },
  {
    city: 'Greater Noida', tag: 'Head Office - Operations', type: 'HEAD OFFICE - OPERATIONS HUB',
    addr: 'Khasra No. 210, Jal Vayu Vihar, Ecotech-3, Greater Noida West, UP - 201306', lat: 28.4744, lng: 77.5040, icon: '🏗️',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Ecotech-III Main Hub', coverage: 'UP, Delhi NCR, Bihar, Bengal, East India',
    desc: 'Greater Noida Ecotech-3 is our main operational hub controlling fleet, drivers and Pan India dispatches.',
    long1: 'Greater Noida is our largest hub with 15+ owned trucks and 50+ attached vehicles. Located in Ecotech-3, it serves Surajpur, Ecotech, Kasna and Dadri industrial areas. Special expertise in factory relocation with 100 Ton hydraulic crane, forklift team and skilled labor for complete plant shifting.',
    long2: 'Greater Noida Strength: Direct access to Eastern Peripheral and Yamuna Expressway for fast movement to Haryana, Punjab, Rajasthan. Offers 7 days free warehouse storage for part-load consolidation, same-day pickup and special rates for Greater Noida to Pune, Mumbai, Ahmedabad.',
    industries: 'Automobile, Electronics, Construction, Garments', routes: 'Greater Noida to Pune, Mumbai, Ahmedabad, Chennai, Hyderabad', speciality: '100 Ton Hydraulic Crane & Factory Shifting',
    services: ['Factory Relocation with 100T Crane', 'Ecotech & Surajpur Pickup', 'Construction Material Transport', 'Eastern Peripheral Advantage', 'Heavy Duty Forklift & Labor Team', 'Greater Noida to Punjab Express']
  },
  {
    city: 'Pune', tag: 'Maharashtra Hub', type: 'WESTERN INDIA HUB - CHAKAN MIDC',
    addr: 'Gat No. 123, Chakan MIDC, Pune-Nashik Highway, Pune, MH - 410501', lat: 18.7600, lng: 73.8500, icon: '🚚',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Chakan MIDC Hub', coverage: 'Maharashtra, Goa, Karnataka, Kerala',
    desc: 'Pune Chakan MIDC branch is our Western India gateway for auto and engineering industries.',
    long1: 'Pune Chakan branch handles daily loads from Chakan, Talegaon, Ranjangaon and Pimpri Chinchwad. Expert in automobile JIT delivery for Tata, Mahindra, Bajaj with returnable packaging management, time-slot delivery and air suspension trucks for fragile parts.',
    long2: 'Pune Reverse Logistics Advantage: As return load hub, offers best rates for Pune to Delhi NCR, Haryana and UP. Warehouse for cross-docking and part-load consolidation to South India. PESO approved chemical tankers also available for chemical companies.',
    industries: 'Automobile, Chemicals, Engineering, IT Hardware', routes: 'Pune to Delhi, Faridabad, Greater Noida, Ahmedabad, Gurgaon', speciality: 'Auto JIT & Chakan MIDC Experts',
    services: ['Chakan MIDC to North India Daily', 'Talegaon Industrial Transport', 'Pune to Delhi Express Cargo', 'Auto Parts JIT Delivery', 'Chemical Tanker Service', 'Pune to Ahmedabad Daily']
  },
  {
    city: 'Ahmedabad', tag: 'Gujarat Hub', type: 'GUJARAT MAIN HUB - ASLALI',
    addr: 'Plot 89, Aslali, Ahmedabad-Bavla Highway, Ahmedabad, GJ - 382427', lat: 23.0100, lng: 72.5500, icon: '🦁',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Aslali Industrial Hub', coverage: 'Gujarat, Rajasthan, MP, Maharashtra',
    desc: 'Ahmedabad Aslali branch is Gujarat main hub for ceramic, chemicals and textile transport.',
    long1: 'Ahmedabad branch at Aslali serves Sanand, Changodar, Bavla, Odhav GIDC. Expert in ceramic tiles transport with wooden box packaging and shock-proof loading to prevent breakage. Daily high-deck trucks for volume goods to North India with 48 hours delivery guarantee to Delhi NCR.',
    long2: 'Ahmedabad Advantage: Best return load rates for Ahmedabad to Delhi NCR. Chemical tanker fleet for hazardous goods with all licenses. Special low-height trucks for ceramic to avoid damage. Direct service to Pune, Mumbai, Delhi, Bangalore with transit insurance.',
    industries: 'Ceramics, Chemicals, Textile, Pharma', routes: 'Ahmedabad to Delhi, Pune, Faridabad, Greater Noida, Bangalore', speciality: 'Ceramic Tiles & Chemical Transport',
    services: ['Aslali to North India Daily', 'Sanand GIDC Transport', 'Ahmedabad to Delhi Daily', 'Ceramic & Tiles Special Packaging', 'Chemical Tanker Service', 'Odhav to Punjab Direct']
  },
  {
    city: 'Vapi', tag: 'Chemical Hub', type: 'CHEMICAL HUB - HAZMAT LICENSED',
    addr: 'Plot 12, GIDC, Near Gunjan, Vapi, GJ - 396195', lat: 20.3700, lng: 72.9000, icon: '🧪',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'GIDC Chemical Hub', coverage: 'South Gujarat, Maharashtra, Daman, Silvassa',
    desc: 'Vapi GIDC branch is chemical capital of India handling hazardous chemical transport with license.',
    long1: 'Vapi branch is specialized for chemical transport in Vapi, Daman, Silvassa and Umargam GIDC. Licensed for hazardous chemical with PESO approval, trained drivers and safety equipment. Daily chemical approved tankers to Delhi NCR, Punjab, Baddi with emergency response team.',
    long2: 'Vapi USP: Only branch with Hazmat and PESO licenses. Stainless steel tankers for pharma and food grade chemicals. Real time tracking with safety alerts, fire extinguisher, spill kit and 24/7 emergency support. Handles acids, solvents and bulk chemicals safely.',
    industries: 'Chemicals, Pharma, Paper, Textile Dyes', routes: 'Vapi to Delhi, Faridabad, Ludhiana, Baddi, Derabassi', speciality: 'Hazmat Chemical - PESO Licensed',
    services: ['Vapi GIDC to North India', 'Hazmat Chemical Transport', 'Vapi to Delhi Chemical Express', 'Pharma Chemical Tanker', 'Vapi to Punjab Direct', 'Safety Trained Chemical Fleet']
  },
  {
    city: 'Neemrana', tag: 'Rajasthan Hub', type: 'RAJASTHAN HUB - JAPANESE ZONE',
    addr: 'RIICO Industrial Area, Near Japanese Zone, Neemrana, RJ - 301705', lat: 28.0500, lng: 76.3800, icon: '🏜️',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Japanese Zone Hub', coverage: 'Rajasthan, Haryana, Gujarat, MP',
    desc: 'Neemrana Japanese Zone branch serves Japanese companies with air suspension trucks and 5S methodology.',
    long1: 'Neemrana branch serves Japanese Zone in Neemrana, Behror, Khushkhera, Bhiwadi. Expert for Japanese OEMs like Daikin, Nissin, Toyoda with high value electronics and auto parts transport using air suspension trucks to prevent vibration damage. Follows Japanese 5S methodology.',
    long2: 'Neemrana Special: On Delhi-Jaipur highway for fastest transit to South India. Air suspension fleet for fragile electronics, factory relocation team with zero damage guarantee, dedicated service for AC, automotive and engineering industries.',
    industries: 'Japanese OEMs, Auto, AC, Electronics', routes: 'Neemrana to Pune, Chennai, Bangalore, Ahmedabad, Hosur', speciality: 'Japanese Companies & Air Suspension',
    services: ['Japanese Zone Transport', 'Neemrana to South India', 'Heavy Duty ODC Shifting', 'Automobile Parts Transport', 'Neemrana to Pune Daily', 'Factory Relocation with 5S']
  },
  {
    city: 'Zirakpur', tag: 'Punjab Gateway', type: 'NORTH GATEWAY - REEFER VAN',
    addr: 'NH-5, Chandigarh-Ambala Road, Zirakpur, PB - 140603', lat: 30.6400, lng: 76.8200, icon: '🏔️',
    phone: '+91 9112020105', email: 'Dineshsharma.alcpl@gmail.Com',
    short: 'Punjab Gateway Hub', coverage: 'Punjab, Himachal, J&K, Haryana, Baddi',
    desc: 'Zirakpur is North India gateway for pharma, apple and perishable transport with reefer vans.',
    long1: 'Zirakpur branch covers Derabassi, Lalru, Baddi, Mohali and Chandigarh. Special refrigerated service for apple from Shimla, Kinnaur and Kashmir during season with -18 to +5 degree controlled vans. Also expert in pharma transport from Baddi pharma hub to Pan India with temperature logger.',
    long2: 'Zirakpur Cold Chain Edge: Only branch with reefer vans for perishable and pharma. Daily trucks to Gujarat, Maharashtra, South India with cold chain compliance. Apple season special fleet to Azadpur, Pune, Mumbai, Bangalore with 24 hours delivery and controlled temperature.',
    industries: 'Pharma, Apple & Perishable, FMCG', routes: 'Zirakpur to Pune, Mumbai, Ahmedabad, Indore, Bangalore', speciality: 'Reefer Van & Apple Season Experts',
    services: ['Zirakpur to Pan India Daily', 'Chandigarh Tricity Transport', 'Baddi Pharma Cold Chain', 'Derabassi Industrial Service', 'Zirakpur to Gujarat Daily', 'Apple Transport - Reefer Van']
  },
];
  // Default map shows the whole of India; clicking a branch zooms to that city
  const indiaMapSrc = 'https://www.google.com/maps?q=India&z=5&output=embed';
  const [mapSrc, setMapSrc] = useState(indiaMapSrc);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const openBranchOnMap = (branch) => {
    setSelectedBranch(branch.city);
    setMapSrc(
      `https://www.google.com/maps?q=${branch.lat},${branch.lng}(${encodeURIComponent(
        'Achiever Logistics - ' + branch.city
      )})&z=12&output=embed`
    );
  };

  // Opens the full branch detail page (from the Home page circle grid)
  const openBranchDetail = (branch) => {
    setBranchView(branch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/customers`)
      .then((res) => res.json())
      .then((data) => console.log(`Backend Connected! Customers: ${data.length}`))
      .catch(() => console.log('Backend Not Connected'));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const sendQuote = async (e) => {
    e.preventDefault();
    const f = e.target;

    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.value,
          phone: f.phone.value,
          email: f.email.value,
          address: f.address.value,
        }),
      });
      console.log('Backend response', res.status);
      console.log('✅ Saved in MySQL!');
    } catch (err) {
      console.log('Backend error', err);
      console.log('❌ Backend OFF hai - pehle backend start karo');
    }

    window.open(
      `https://wa.me/91${PRIMARY_PHONE}?text=Hi%20${f.name.value}%2C%20Phone%3A%20${f.phone.value}%2C%20Email%3A%20${f.email.value}%2C%20Address%3A%20${encodeURIComponent(f.address.value)}`,
      '_blank'
    );
    setShowQuote(false);
  };

  const goTo = (page) => {
    setBranchView(null);
    setActive(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="web">
      {/* TOP UTILITY BAR - DHL style, now with WORKING links */}
      <div className="top-bar">
        <div className="top-bar-left">
          <a href={`tel:+91${PRIMARY_PHONE}`}>📞 +91 {PRIMARY_PHONE}</a>
          <a href={`mailto:${PRIMARY_EMAIL}`}>✉ {PRIMARY_EMAIL}</a>
          <span className="top-bar-website">🚚 We Deliver Trust, On Time.</span>
        </div>
        <div className="top-bar-right"></div>
      </div>

      {/* HEADER */}
      <header className="top-nav">
        <div className="logo-area">
          <img src="/logo.jpg" alt="AL Logo" style={{ height: '45px', width: 'auto' }} />
          <div>
            <h2>ACHIEVER</h2>
            <p>{COMPANY_TAGLINE.toUpperCase()}</p>
          </div>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <span className={active === 'home' && !branchView ? 'on' : ''} onClick={() => goTo('home')}>Home</span>
          <span className={active === 'services' ? 'on' : ''} onClick={() => goTo('services')}>Services</span>
          <span className={active === 'why-us' ? 'on' : ''} onClick={() => goTo('why-us')}>Why Us</span>
          <span className={active === 'industries' ? 'on' : ''} onClick={() => goTo('industries')}>Industries</span>
          <span className={active === 'about' ? 'on' : ''} onClick={() => goTo('about')}>About Us</span>
          <span className={active === 'contact' ? 'on' : ''} onClick={() => goTo('contact')}>Contact</span>
          <button className="quote-btn" onClick={() => setShowQuote(true)}>Get a Quote</button>
        </nav>
      </header>

      {branchView && (
<div style={{background:'#f9fafb', minHeight:'100vh', paddingBottom:'40px'}}>
  <div style={{background:'linear-gradient(90deg, #b91c1c, #dc2626)', padding:'45px 20px', color:'#fff'}}>
    <div style={{maxWidth:'1150px', margin:'0 auto'}}>
      <button onClick={()=>setBranchView(null)} style={{background:'#fff', color:'#b91c1c', border:'none', padding:'10px 18px', borderRadius:'8px', fontWeight:'800', cursor:'pointer'}}>← Back to Branches</button>
      <h1 style={{fontSize:'34px', fontWeight:'900', margin:'18px 0 8px'}}>Achiever Logistics - {branchView.city}</h1>
      <p style={{color:'#fecaca', maxWidth:'900px', lineHeight:'1.6', fontSize:'14px'}}>{branchView.coverage} | {branchView.speciality}</p>
    </div>
  </div>

  <div style={{maxWidth:'1150px', margin:'0 auto', padding:'24px 20px', display:'grid', gridTemplateColumns:'2fr 1.1fr', gap:'24px'}}>
    {/* LEFT CONTENT */}
    <div>
      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'24px', marginBottom:'20px', transition:'all 0.3s'}} onMouseEnter={e=>e.currentTarget.style.borderColor='#fecaca'} onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}>
        <div style={{fontSize:'10px', fontWeight:'900', color:'#fff', background:'#b91c1c', display:'inline-block', padding:'4px 10px', borderRadius:'20px', letterSpacing:'1px', marginBottom:'12px'}}>REGISTERED OFFICE ADDRESS</div>
        <p style={{fontSize:'15px', fontWeight:'700'}}>{branchView.addr}</p>
        <h3 style={{fontSize:'16px', fontWeight:'900', margin:'22px 0 10px'}}>About {branchView.city} Branch</h3>
        <p style={{fontSize:'13.5px', color:'#374151', lineHeight:'1.9'}}>{branchView.long1}</p>
        <p style={{fontSize:'13.5px', color:'#374151', lineHeight:'1.9', marginTop:'14px'}}>{branchView.long2}</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'22px'}}>
          <div style={{background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px', padding:'16px'}}><div style={{fontSize:'10px', fontWeight:'800', color:'#b91c1c', letterSpacing:'1px'}}>CORE INDUSTRIES</div><div style={{fontSize:'13px', fontWeight:'700', marginTop:'6px'}}>{branchView.industries}</div></div>
          <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'16px'}}><div style={{fontSize:'10px', fontWeight:'800', color:'#6b7280', letterSpacing:'1px'}}>KEY ROUTES</div><div style={{fontSize:'12px', fontWeight:'700', marginTop:'6px', lineHeight:'1.5'}}>{branchView.routes}</div></div>
        </div>
        <div style={{background:'#111827', color:'#fff', borderRadius:'12px', padding:'14px 16px', marginTop:'14px', fontSize:'12.5px'}}><b style={{color:'#fca5a5'}}>SPECIALITY:</b> {branchView.speciality} <span style={{margin:'0 8px', color:'#4b5563'}}>|</span> <b style={{color:'#fca5a5'}}>COVERAGE:</b> {branchView.coverage}</div>
      </div>

      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'24px', marginBottom:'20px'}}>
        <div style={{fontSize:'10px', fontWeight:'900', color:'#fff', background:'#111827', display:'inline-block', padding:'4px 10px', borderRadius:'20px', letterSpacing:'1px', marginBottom:'10px'}}>SERVICES - UNIQUE FOR THIS BRANCH</div>
        <h3 style={{fontSize:'18px', fontWeight:'900', marginBottom:'14px'}}>Services Available in {branchView.city}</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
          {branchView.services.map(s=><div key={s} style={{background:'#fef2f2', border:'1px solid #fecaca', padding:'11px 12px', borderRadius:'10px', fontSize:'12px', fontWeight:'700', transition:'all 0.25s', cursor:'default'}} onMouseEnter={e=>{e.currentTarget.style.background='#b91c1c'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#b91c1c'}} onMouseLeave={e=>{e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#111827'; e.currentTarget.style.borderColor='#fecaca'}}><span style={{color:'#b91c1c'}}>✓</span> <span style={{marginLeft:'4px'}}>{s}</span></div>)}
        </div>
      </div>

      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'24px', transition:'all 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.background='#b91c1c'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#b91c1c'}} onMouseLeave={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#111827'; e.currentTarget.style.borderColor='#e5e7eb'}}>
        <div style={{fontSize:'10px', fontWeight:'900', letterSpacing:'1px', background:'#111827', color:'#fff', display:'inline-block', padding:'4px 10px', borderRadius:'20px', marginBottom:'10px'}}>TRUST & CREDIBILITY</div>
        <h3 style={{fontSize:'16px', fontWeight:'900', marginBottom:'10px'}}>Why Businesses Trust Our {branchView.city} Branch?</h3>
        <p style={{fontSize:'13px', lineHeight:'1.8', opacity:'0.9'}}>We are not brokers. We own our fleet in {branchView.city} with 24/7 dedicated team. With {branchView.speciality} expertise, we have served 500+ companies from this location with 98% on-time delivery, zero damage insurance and transparent GST billing.</p>
        <div style={{marginTop:'16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'12px', fontWeight:'600'}}>
          <div>✓ Owned Trucks in {branchView.city}</div><div>✓ Live GPS Tracking</div><div>✓ 100% Transit Insurance</div><div>✓ 24/7 Contractor Support</div><div>✓ GST + E-Way Bill Support</div><div>✓ Photo POD on WhatsApp</div>
        </div>
      </div>
    </div>

    {/* RIGHT SIDEBAR - FILLS EMPTY SPACE - ALL RED HOVER */}
    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
      <div style={{background:'#fff', border:'2px solid #fecaca', borderRadius:'16px', padding:'22px', transition:'all 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.background='#b91c1c'; e.currentTarget.style.color='#fff'}} onMouseLeave={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#111827'}}>
        <div style={{fontSize:'10px', fontWeight:'900', letterSpacing:'1px', background:'#fef2f2', color:'#b91c1c', display:'inline-block', padding:'4px 10px', borderRadius:'20px', marginBottom:'10px'}}>CONTACT</div>
        <h3 style={{fontSize:'15px', fontWeight:'900', marginBottom:'12px'}}>Contact {branchView.city}</h3>
       <div style={{fontSize:'13px', lineHeight:'2.2'}}>
  <a href={`tel:${branchView.phone}`} style={{textDecoration:'none', color:'inherit', cursor:'pointer', display:'block'}}>📞 {branchView.phone}</a>
  <a href={`mailto:${branchView.email}`} style={{textDecoration:'none', color:'inherit', cursor:'pointer', display:'block'}}>✉️ {branchView.email}</a>
  <a href={`https://wa.me/${branchView.phone.replace(/\D/g,'')}?text=Hello%20Achiever%20Logistics`} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'inherit', cursor:'pointer', display:'block'}}>💬 WhatsApp Support</a>
  <span>9 AM to 8 PM - All Days</span>
</div>
        <button onClick={()=>setShowQuote(true)} style={{marginTop:'14px', width:'100%', background:'#111827', color:'#fff', border:'none', padding:'12px', borderRadius:'10px', fontWeight:'800', cursor:'pointer'}}>Get Free Quote →</button>
      </div>

      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'22px', transition:'all 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.background='#b91c1c'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#b91c1c'}} onMouseLeave={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#111827'; e.currentTarget.style.borderColor='#e5e7eb'}}>
        <div style={{fontSize:'10px', fontWeight:'900', letterSpacing:'1px', background:'#111827', color:'#fff', display:'inline-block', padding:'4px 10px', borderRadius:'20px', marginBottom:'10px'}}>HIGHLIGHTS</div>
        <h3 style={{fontSize:'14px', fontWeight:'900', marginBottom:'10px'}}>🏆 Branch Highlights</h3>
        <div style={{fontSize:'12.5px', lineHeight:'1.9', display:'flex', flexDirection:'column', gap:'6px'}}>
          <div><b>Expertise:</b> {branchView.speciality}</div>
          <div><b>Routes:</b> {branchView.routes.split(',').slice(0,2).join(', ')}</div>
          <div><b>Industries:</b> {branchView.industries}</div>
          <div><b>Support:</b> Direct contractor</div>
          <div><b>Billing:</b> Transparent GST invoice</div>
        </div>
      </div>

      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'22px', transition:'all 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.background='#b91c1c'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#b91c1c'}} onMouseLeave={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#111827'; e.currentTarget.style.borderColor='#e5e7eb'}}>
        <div style={{fontSize:'10px', fontWeight:'900', letterSpacing:'1px', background:'#fef2f2', color:'#b91c1c', display:'inline-block', padding:'4px 10px', borderRadius:'20px', marginBottom:'10px'}}>PERFORMANCE</div>
        <h3 style={{fontSize:'14px', fontWeight:'900', marginBottom:'12px'}}>📊 Branch Stats</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'12px'}}>
          <div style={{background:'rgba(0,0,0,0.04)', padding:'10px', borderRadius:'10px', textAlign:'center'}}><div style={{fontSize:'18px', fontWeight:'900'}}>500+</div><div style={{fontSize:'10px', opacity:'0.7'}}>Clients Served</div></div>
          <div style={{background:'rgba(0,0,0,0.04)', padding:'10px', borderRadius:'10px', textAlign:'center'}}><div style={{fontSize:'18px', fontWeight:'900'}}>98%</div><div style={{fontSize:'10px', opacity:'0.7'}}>On-Time</div></div>
          <div style={{background:'rgba(0,0,0,0.04)', padding:'10px', borderRadius:'10px', textAlign:'center'}}><div style={{fontSize:'18px', fontWeight:'900'}}>50+</div><div style={{fontSize:'10px', opacity:'0.7'}}>Own Trucks</div></div>
          <div style={{background:'rgba(0,0,0,0.04)', padding:'10px', borderRadius:'10px', textAlign:'center'}}><div style={{fontSize:'18px', fontWeight:'900'}}>24/7</div><div style={{fontSize:'10px', opacity:'0.7'}}>Support</div></div>
        </div>
      </div>

      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'22px', transition:'all 0.3s'}} onMouseEnter={e=>{e.currentTarget.style.background='#111827'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#111827'}} onMouseLeave={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#111827'; e.currentTarget.style.borderColor='#e5e7eb'}}>
        <div style={{fontSize:'10px', fontWeight:'900', letterSpacing:'1px', background:'#b91c1c', color:'#fff', display:'inline-block', padding:'4px 10px', borderRadius:'20px', marginBottom:'10px'}}>SAFETY & COMPLIANCE</div>
        <h3 style={{fontSize:'14px', fontWeight:'900', marginBottom:'10px'}}>🛡️ Safety Standards</h3>
        <ul style={{fontSize:'12px', lineHeight:'2', paddingLeft:'16px', margin:0}}>
          <li>GPS Tracking + Speed Control</li>
          <li>100% Transit Insurance</li>
          <li>Verified Drivers + License Check</li>
          <li>GST, E-Way Bill, LR - All Included</li>
          <li>Photo POD on WhatsApp</li>
        </ul>
      </div>

      <div style={{background:'linear-gradient(135deg, #b91c1c, #dc2626)', borderRadius:'16px', padding:'22px', color:'#fff'}}>
        <div style={{fontSize:'10px', fontWeight:'900', letterSpacing:'1px', background:'#fff', color:'#b91c1c', display:'inline-block', padding:'4px 10px', borderRadius:'20px', marginBottom:'10px'}}>QUICK ACTION</div>
        <h3 style={{fontSize:'14px', fontWeight:'900', marginBottom:'8px'}}>Need Urgent Truck in {branchView.city}?</h3>
        <p style={{fontSize:'12px', color:'#fecaca', lineHeight:'1.6'}}>Call our {branchView.city} control room for same-day pickup and best rates.</p>
        <div style={{marginTop:'12px', fontSize:'13px', fontWeight:'800'}}>📞 {branchView.phone}</div>
      </div>
    </div>
  </div>
</div>
)}
      {/* Everything below only shows when no branch detail page is open */}
      {!branchView && (
        <>
          {/* HOME */}
          {active === 'home' && (
            <>
              <section className="hero-main">
                <div className="hero-left">
                  <div className="hero-card">
                    <span className="badge-pill">🔥 {COMPANY_TAGLINE.toUpperCase()}</span>
                    <h1>
                      DELIVERING YOUR CARGO.
                      <br />
                      <span className="accent">EVERYDAY. ON TIME.</span>
                    </h1>
                    <p>
                      Reliable Delhi ⇄ Pune Daily Service - Fast, Secure, and Nationwide Logistics Solutions for your
                      business.
                    </p>
                    <div className="hero-btns">
                      <button onClick={() => goTo('why-us')} className="btn-solid">Why Choose Us</button>
                      <button className="btn-outline" onClick={() => setShowQuote(true)}>→ Get Free Quote</button>
                    </div>
                    <div className="stats">
                      <div>✔ 5000+ Shipments Monthly</div>
                      <div>● 98.5% On-Time</div>
                      <div>◍ 24/7 Support</div>
                    </div>
                  </div>
                </div>
                <div className="hero-right">
                  <img src={truckImg} alt="Achiever Truck" className="hero-img" style={{ width: '100%', maxWidth: '720px', height: 'auto' }} />
                </div>
              </section>

              {/* WHY CHOOSE US - QUICK HIGHLIGHTS (real, verified facts) */}
              <section className="highlight-strip">
                <div className="highlight-item" onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                  <span className="hi-icon">🚛</span>
                  <p>Owned Fleet, No Broker Delays</p>
                </div>
                <div className="highlight-item" onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                  <span className="hi-icon">📄</span>
                  <p>Transparent Billing & Documentation</p>
                </div>
                <div className="highlight-item" onClick={() => window.scrollTo({ top: 1500, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                  <span className="hi-icon">🏢</span>
                  <p>8 Offices Across Pan India</p>
                </div>
                <div className="highlight-item" onClick={() => window.scrollTo({ top: 2500, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                  <span className="hi-icon">📞</span>
                  <p>Direct Contractor Support</p>
                </div>
              </section>

              {/* COMPACT NETWORK RIBBON */}
              <section className="network-ribbon">
                <span>🏢 Admin Office: New Delhi</span>
                <span className="dot-sep">•</span>
                <span>📋 Registered Office: Faridabad</span>
                <span className="dot-sep">•</span>
                <span>📍 Branches: Ahmedabad · Greater Noida · Neemrana · Vapi · Zirakpur ·Pune </span>
              </section>

                                         {/* ABOUT OUR COMPANY - Premium Box with CSS */}
              <section style={{padding:'70px 20px', background:'#ffffff'}}>
                <div style={{maxWidth:'1150px', margin:'0 auto', display:'flex', flexWrap:'wrap', gap:'50px', alignItems:'center'}}>
                  
                  {/* Left Content - Bigger Box */}
                  <div style={{flex:'1 1 520px', background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:'20px', padding:'36px', boxShadow:'0 20px 50px rgba(0,0,0,0.08)'}}>
                    <span style={{background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c', padding:'7px 16px', borderRadius:'20px', fontSize:'11px', fontWeight:'900', letterSpacing:'1px'}}>ABOUT OUR COMPANY</span>
                    
                    <h2 style={{fontSize:'36px', fontWeight:'900', margin:'16px 0 14px', color:'#111827', lineHeight:'1.15', letterSpacing:'-0.5px'}}>Achiever Logistics Cargo<br/><span style={{color:'#b91c1c'}}>Private Limited, India</span></h2>
                    
                    <p style={{fontSize:'15.5px', lineHeight:'1.9', color:'#374151', marginTop:'12px', fontWeight:'500'}}>
                      <b style={{color:'#111827'}}>Achiever Logistics Cargo Pvt. Ltd.</b> is a Govt. Registered, ISO 9001:2015 Certified fleet owner and transport contractor company in India. With <b style={{color:'#b91c1c'}}>50+ owned commercial vehicles</b>, Pan India National Permit and <b>20+ years of collective experience</b>, we handle your logistics safely, securely and on-time.
                    </p>
                    <p style={{fontSize:'15px', lineHeight:'1.9', color:'#4b5563', marginTop:'14px'}}>
                      We are a one-stop solution for all freight needs — <b>Residential Relocation, Industrial Logistics, Commercial Goods & Vehicle Transportation</b>. Our expert team manages everything from professional packing, safe loading, transit handling to final unloading and re-arranging at your doorstep.
                      <br/><br/>
                      Our <b>Admin Office is in New Delhi</b> and <b>Registered Office in Faridabad</b> with 6 more branches across India covering our flagship <b style={{color:'#b91c1c'}}>Delhi-Pune Daily Premium Service</b>. We specialize in FTL, Part Load, ODC, Car Carrier and Warehousing solutions.
                    </p>

                    <div style={{display:'flex', gap:'10px', marginTop:'24px', flexWrap:'wrap'}}>
                      <div style={{background:'#f9fafb', border:'1.5px solid #e5e7eb', padding:'10px 16px', borderRadius:'10px', fontSize:'12.5px', fontWeight:'800', color:'#111827', display:'flex', alignItems:'center', gap:'6px'}}>✓ <span style={{color:'#b91c1c'}}>Owned Fleet</span></div>
                      <div style={{background:'#f9fafb', border:'1.5px solid #e5e7eb', padding:'10px 16px', borderRadius:'10px', fontSize:'12.5px', fontWeight:'800', color:'#111827', display:'flex', alignItems:'center', gap:'6px'}}>✓ <span style={{color:'#b91c1c'}}>GST Compliant</span></div>
                      <div style={{background:'#fef2f2', border:'1.5px solid #fecaca', padding:'10px 16px', borderRadius:'10px', fontSize:'12.5px', fontWeight:'800', color:'#b91c1c'}}>✓ 24/7 Support</div>
                    </div>

                    <button onClick={()=>goTo('about')} style={{marginTop:'26px', background:'#111827', color:'#fff', border:'none', padding:'13px 26px', borderRadius:'10px', fontSize:'13px', fontWeight:'800', cursor:'pointer', letterSpacing:'0.3px'}}>More About Us →</button>
                  </div>

                  {/* Right Image with 20+ Badge */}
                  <div style={{flex:'1 1 420px', position:'relative'}}>
                    <div style={{borderRadius:'20px', overflow:'hidden', boxShadow:'0 25px 60px rgba(0,0,0,0.15)', border:'1px solid #e5e7eb'}}>
                      <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700" alt="Achiever Logistics Warehouse" style={{width:'100%', height:'420px', objectFit:'cover'}} />
                    </div>
                    {/* 20+ Badge - Bigger */}
                    <div style={{position:'absolute', bottom:'-22px', left:'-22px', background:'#b91c1c', color:'#fff', padding:'20px 26px', borderRadius:'14px', boxShadow:'0 14px 28px rgba(185,28,28,0.35)', border:'3px solid #fff'}}>
                      <div style={{fontSize:'32px', fontWeight:'900', lineHeight:'1'}}>20+</div>
                      <div style={{fontSize:'12px', fontWeight:'700', opacity:0.95, marginTop:'4px', letterSpacing:'0.5px'}}>Years Experience</div>
                    </div>
                    {/* Small Info Badge Top */}
                    <div style={{position:'absolute', top:'18px', right:'18px', background:'#ffffff', padding:'10px 14px', borderRadius:'10px', boxShadow:'0 8px 20px rgba(0,0,0,0.12)', fontSize:'11px', fontWeight:'800', color:'#111827', border:'1px solid #e5e7eb'}}>
                      📦 50+ Trucks | Pan India
                    </div>
                  </div>

                </div>
              </section>
                                        {/* WHY ACHIEVER LOGISTICS - Professional Clickable */}
              <section style={{padding:'70px 20px', background:'#f9fafb'}}>
                <div style={{maxWidth:'1150px', margin:'0 auto'}}>
                  <div style={{textAlign:'center', marginBottom:'42px'}}>
                    <span style={{background:'#fff', border:'1.5px solid #fecaca', color:'#b91c1c', padding:'7px 16px', borderRadius:'20px', fontSize:'11px', fontWeight:'900', letterSpacing:'1px', boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>WHY ACHIEVER LOGISTICS</span>
                    <h2 style={{fontSize:'34px', fontWeight:'900', margin:'16px 0 10px', color:'#111827', letterSpacing:'-0.5px'}}>India's Most Trusted <span style={{color:'#b91c1c'}}>Fleet Owner</span> Company</h2>
                    <p style={{fontSize:'14.5px', color:'#6b7280', maxWidth:'720px', margin:'0 auto', lineHeight:'1.7'}}>We are not brokers or aggregators — We are direct fleet owners with owned vehicles, trained drivers and verified infrastructure.</p>
                  </div>

                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(360px, 1fr))', gap:'28px'}}>
                    
                    {/* Box 1 - Clickable */}
                    <div onClick={()=>goTo('about')} style={{background:'#ffffff', borderRadius:'18px', padding:'32px', border:'1.5px solid #e5e7eb', boxShadow:'0 10px 30px rgba(0,0,0,0.06)', cursor:'pointer', transition:'all 0.25s ease'}}
                      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.10)'; e.currentTarget.style.borderColor='#b91c1c'}}
                      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='#e5e7eb'}}
                    >
                      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
                        <div style={{width:'48px', height:'48px', background:'#111827', color:'#fff', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px'}}>🚛</div>
                        <h3 style={{fontSize:'19px', fontWeight:'900', margin:0, color:'#111827'}}>Our Fleet & Infrastructure</h3>
                      </div>
                      <p style={{fontSize:'14px', lineHeight:'1.9', color:'#4b5563'}}>
                        <b style={{color:'#111827'}}>Achiever Logistics Cargo Pvt. Ltd.</b> owns <b style={{color:'#b91c1c'}}>50+ commercial vehicles</b> including 17ft, 20ft, 22ft, 24ft, 32ft SXL, Low-bed Trailers, Hydraulic Axles and Container Trucks. All vehicles are GPS enabled with Pan India National Permit and FASTag.
                        <br/><br/>
                        Our infrastructure includes <b>8 Offices</b> — New Delhi (Admin), Faridabad (Registered), Ahmedabad, Greater Noida, Neemrana, Vapi, Zirakpur and Pune (Pimpri-Chinchwad). We operate <b>20,000+ sq. ft.</b> of secured warehousing space across Delhi-NCR and Pune.
                      </p>
                      <div style={{marginTop:'20px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
                        <span style={{background:'#111827', color:'#fff', padding:'7px 12px', borderRadius:'8px', fontSize:'11px', fontWeight:'800'}}>50+ Owned Trucks</span>
                        <span style={{background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c', padding:'7px 12px', borderRadius:'8px', fontSize:'11px', fontWeight:'800'}}>Pan India Permit</span>
                        <span style={{background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c', padding:'7px 12px', borderRadius:'8px', fontSize:'11px', fontWeight:'800'}}>GPS Tracking</span>
                      </div>
                      <div style={{marginTop:'18px', fontSize:'12px', fontWeight:'800', color:'#b91c1c'}}>Explore Infrastructure →</div>
                    </div>

                    {/* Box 2 - Clickable Red */}
                    <div onClick={()=>setShowQuote(true)} style={{background:'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)', borderRadius:'18px', padding:'32px', color:'#fff', boxShadow:'0 14px 34px rgba(185,28,28,0.30)', cursor:'pointer', transition:'all 0.25s ease', position:'relative', overflow:'hidden'}}
                      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 22px 44px rgba(185,28,28,0.40)'}}
                      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 14px 34px rgba(185,28,28,0.30)'}}
                    >
                      <div style={{position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', background:'rgba(255,255,255,0.08)', borderRadius:'50%'}}></div>
                      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'18px', position:'relative'}}>
                        <div style={{width:'48px', height:'48px', background:'#fff', color:'#b91c1c', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'900'}}>✓</div>
                        <h3 style={{fontSize:'19px', fontWeight:'900', margin:0, color:'#fff'}}>What Makes Us Different?</h3>
                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:'13px', position:'relative'}}>
                        {[
                          ['Direct Contractor, No Broker','You deal directly with the owner — no commission, faster response, direct accountability.'],
                          ['Delhi-Pune Daily Service','Our flagship route with 24-hour guaranteed delivery and daily fixed dispatch.'],
                          ['100% Safe & Insured','Transit insurance, professional packing, zero-damage handling & live tracking.'],
                          ['Transparent Billing','Proper GST invoice, E-way bill, LR copy — no hidden charges ever.'],
                          ['24/7 Customer Support','Dedicated manager for each shipment with WhatsApp live updates.'],
                        ].map(([title, desc])=>(
                          <div key={title} style={{display:'flex', gap:'10px'}}>
                            <div style={{minWidth:'7px', height:'7px', background:'#fff', borderRadius:'50%', marginTop:'7px'}}></div>
                            <div><b style={{fontSize:'13.5px', color:'#fff'}}>{title}: </b><span style={{fontSize:'13px', color:'#fecaca', lineHeight:'1.6'}}>{desc}</span></div>
                          </div>
                        ))}
                      </div>
                      <button style={{marginTop:'22px', background:'#fff', color:'#b91c1c', border:'none', padding:'12px 20px', borderRadius:'10px', fontWeight:'900', fontSize:'12.5px', cursor:'pointer', width:'100%', letterSpacing:'0.3px', position:'relative'}}>Get Free Quote Now →</button>
                    </div>

                  </div>
                </div>
              </section>

              {/* BENEFITS - Why People Believe In Us */}
              <section style={{padding:'60px 20px', background:'#ffffff'}}>
                <div style={{maxWidth:'1000px', margin:'0 auto', background:'#fff', border:'1px solid #e5e7eb', borderRadius:'18px', padding:'36px', boxShadow:'0 10px 30px rgba(0,0,0,0.04)'}}>
                  <div style={{textAlign:'center'}}>
                    <span style={{color:'#b91c1c', fontWeight:'800', fontSize:'11px', letterSpacing:'1px'}}>WHY PEOPLE BELIEVE IN US</span>
                    <h2 style={{fontSize:'24px', fontWeight:'900', margin:'10px 0 14px', color:'#111827'}}>Benefits of Choosing Achiever Logistics for Relocation in India</h2>
                    <p style={{fontSize:'13.5px', color:'#6b7280', lineHeight:'1.7', maxWidth:'700px', margin:'0 auto 28px'}}>Relocating requires meticulous planning and expert handling. We streamline the entire process to make it comfortable and stress-free for you.</p>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'14px'}}>
                    {[
                      ['Professional Expertise','Experienced specialists skilled in handling all types of cargo, furniture disassembly and efficient loading.'],
                      ['Time Saving Convenience','We handle packing, loading and unloading so you can focus on your business and family.'],
                      ['Premium Packing Material','High-quality bubble wrap, cartons and lamination for zero-damage transit guarantee.'],
                      ['Safe & Insured Transport','Well-maintained fleet, verified drivers, transit insurance and live GPS tracking.'],
                      ['End-to-End Services','From packing to re-arranging at your new location - complete door-to-door service.'],
                      ['Cost-Effective Solution','Transparent pricing, no hidden charges, best market rates with GST invoice.'],
                    ].map(([t,d])=>(
                      <div key={t} style={{display:'flex', gap:'10px', background:'#f9fafb', border:'1px solid #f3f4f6', borderRadius:'10px', padding:'12px 14px'}}>
                        <span style={{color:'#b91c1c', fontWeight:'900', marginTop:'2px'}}>✔</span>
                        <div><b style={{fontSize:'13px', color:'#111827'}}>{t}:</b><span style={{fontSize:'13px', color:'#4b5563', lineHeight:'1.6'}}> {d}</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{textAlign:'center', marginTop:'26px'}}><button onClick={()=>setShowQuote(true)} style={{background:'#b91c1c', color:'#fff', border:'none', padding:'11px 22px', borderRadius:'8px', fontWeight:'800', cursor:'pointer', fontSize:'13px'}}>Get Free Moving Quote →</button></div>
                </div>
              </section>

              {/* OUR BRANCHES - Round Image + Red on Hover */}
              <section className="branch-explore-section" style={{padding:'60px 20px', background:'#f8fafc', textAlign:'center'}}>
                <span style={{color:'#b91c1c', fontWeight:'800', fontSize:'11px', letterSpacing:'1px'}}>OUR BRANCHES</span>
                <h2 style={{fontSize:'26px', fontWeight:'900', margin:'8px 0 8px', color:'#111827'}}>Explore Top Locations</h2>
                <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'24px'}}>Click any branch to view full professional details</p>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:'18px', maxWidth:'800px', margin:'0 auto'}}>
                  {branches.map((b) => (
                    <div key={b.city} onClick={() => openBranchDetail(b)} 
                      style={{
                        background:'#fff', border:'1.5px solid #e5e7eb', borderRadius:'14px', padding:'20px 12px', cursor:'pointer', 
                        boxShadow:'0 4px 12px rgba(0,0,0,0.05)', transition:'all 0.25s ease'
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background='#b91c1c'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#b91c1c'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(185,28,28,0.25)'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#111827'; e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.05)'}}
                    >
                      <div style={{width:'64px', height:'64px', borderRadius:'50%', background:'#fef2f2', border:'3px solid #fecaca', margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px'}}>
                        {b.icon}
                      </div>
                      <div style={{fontWeight:'800', fontSize:'14px'}}>{b.city}</div>
                      <div style={{fontSize:'11px', opacity:0.7, marginTop:'3px'}}>{b.tag}</div>
                      <div style={{fontSize:'10px', marginTop:'8px', fontWeight:'700', color:'inherit', opacity:0.8}}>VIEW DETAILS →</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>goTo('contact')} style={{marginTop:'28px', background:'#111827', color:'#fff', border:'none', padding:'11px 22px', borderRadius:'8px', fontWeight:'700', fontSize:'12px', cursor:'pointer'}}>View More Locations →</button>
              </section>

              {/* ANIMATED STATS - VRL/DHL style */}
              <section className="counters-section">
                <div className="counter-item">
                  <Counter end={20} suffix="+" />
                  <p>Years of Experience</p>
                </div>
                <div className="counter-item">
                  <Counter end={5000} suffix="+" />
                  <p>Happy Clients</p>
                </div>
                <div className="counter-item">
                  <Counter end={50} suffix="+" />
                  <p>Fleet of Trucks</p>
                </div>
                <div className="counter-item">
                  <Counter end={100} suffix="+" />
                  <p>Cities Covered</p>
                </div>
                <div className="counter-item">
                  <Counter end={98} suffix="%" />
                  <p>On-Time Delivery</p>
                </div>
              </section>

              <section className="core">
                <span className="section-tag">WHAT WE OFFER</span>
                <h2>OUR CORE SERVICES</h2>
                <p>Comprehensive logistics solutions tailored for businesses of all sizes</p>
                <div className="cards">
                  <div onClick={() => goTo('services')}>
                    <i>🚛</i>
                    <h3>Road Freight</h3>
                    <p>Full truckload and part load services across India with real-time monitoring.</p>
                    <span>Learn More →</span>
                  </div>
                  <div onClick={() => goTo('services')}>
                    <i>🏭</i>
                    <h3>Warehousing & Distribution</h3>
                    <p>Secure warehousing facilities with inventory management across major hubs.</p>
                    <span>Learn More →</span>
                  </div>
                  <div onClick={() => goTo('services')}>
                    <i>📦</i>
                    <h3>Express Parcel</h3>
                    <p>Time-sensitive express deliveries with doorstep pickup and live tracking.</p>
                    <span>Learn More →</span>
                  </div>
                </div>
              </section>

              <section className="delhi-pune">
                <div className="red-box">
                  <h3>✈ DELHI TO PUNE DAILY SERVICE</h3>
                  <p>Daily Departure: 08:00 PM from Delhi Hub • Transit Time: 24-28 Hours • Capacity: Up to 20 MT per trip</p>
                  <div className="next">Next Departure: Today 08:00 PM • Live Tracking Enabled</div>
                  <small>Doorstep delivery available across Pune & surrounding areas</small>
                </div>
                <div className="why-box">
                  <h3>Why Choose This Route?</h3>
                  <p>✔ Daily operations, no delays</p>
                  <p>✔ GPS-tracked vehicles for complete transparency</p>
                  <p>✔ Dedicated customer support for Pune region</p>
                  <div className="cert">Pan India Network | GST Compliant | 24x7 Support</div>
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="testimonial-section">
                <span className="section-tag">CLIENT VOICES</span>
                <h2>What Our Clients Say</h2>
                <div className="testimonial-card">
                  <div className="quote-mark">"</div>
                  <p className="testimonial-text">{testimonials[testimonialIndex].text}</p>
                  <b>{testimonials[testimonialIndex].name}</b>
                  <span>{testimonials[testimonialIndex].company}</span>
                  <div className="dots">
                    {testimonials.map((_, i) => (
                      <span
                        key={i}
                        className={`dot ${i === testimonialIndex ? 'active' : ''}`}
                        onClick={() => setTestimonialIndex(i)}
                      ></span>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA BANNER */}
              <section className="cta-banner">
                <h2>Ready to Ship With India's Trusted Logistics Partner?</h2>
                <p>Get a free quote in minutes — no hidden charges, no delays.</p>
                <button onClick={() => setShowQuote(true)}>Get Free Quote Now →</button>
              </section>
            </>
          )}

          {/* SERVICES */}
          {active === 'services' && (
            <section className="services-section">
              <div className="services-head">
                <span className="section-tag">SERVICES</span>
                <h1>Comprehensive Logistics Solutions</h1>
                <p className="sub">Pick a service to get a custom quote — one call, no middlemen</p>
              </div>

              {/* CORE TRANSPORT SERVICES */}
              <div className="service-category">
                <h2 className="cat-title"><span>🚛</span> Core Transport Services</h2>
                <div className="service-grid">
                  {[
                    ['🚛', 'Full Load (FTL)', '17ft to 32ft trucks, All India Permit'],
                    ['🏗️', 'ODC Transport', 'Over Dimensional Cargo - Low bed trailers'],
                    ['🚚', 'Local Transportation', 'City & regional tempo services'],
                    ['💪', 'Loading / Unloading', 'Expert labour team, 24/7 available'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} onClick={() => setShowQuote(true)} className="service-card">
                      <div className="sc-icon-wrap"><span className="sc-icon">{icon}</span></div>
                      <div className="sc-body">
                        <h3>{title}</h3>
                        <p>{desc}</p>
                        <span className="sc-link">Book This Service →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RELOCATION & STORAGE */}
              <div className="service-category">
                <h2 className="cat-title"><span>📦</span> Relocation & Storage</h2>
                <div className="service-grid">
                  {[
                    ['📦', 'Packers & Movers', 'Home & office shifting, safe packing'],
                    ['🏠', 'House Shifting Special', '1BHK to 4BHK shifting with full packing'],
                    ['🏭', 'Warehousing', 'Secure multi-city storage facilities'],
                    ['🚗', 'Car & Bike Transport', 'Insured vehicle transport, Pan India'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} onClick={() => setShowQuote(true)} className="service-card">
                      <div className="sc-icon-wrap"><span className="sc-icon">{icon}</span></div>
                      <div className="sc-body">
                        <h3>{title}</h3>
                        <p>{desc}</p>
                        <span className="sc-link">Book This Service →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRIORITY NETWORK BAND - single quote CTA */}
              <div className="service-priority" onClick={() => setShowQuote(true)}>
                <div>
                  <span className="badge-pill">⚡ PRIORITY SERVICE</span>
                  <h3>Pan India Express Network</h3>
                  <p>Direct dispatch across our 8-office network — New Delhi, Faridabad, Ahmedabad, Greater Noida, Neemrana, Vapi , Zirakpur & Pune.</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setShowQuote(true); }}>Get a Free Quote →</button>
              </div>
            </section>
          )}

          {/* Why-Us */}
          {active === 'why-us' && (
            <div className="why-us-page">
              <style>{`
                .why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; justify-content: center; max-width: 1100px; margin: 0 auto; }
                @media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 600px) { .why-grid { grid-template-columns: 1fr; } }
                .why-card { background:white; border:1px solid #e5e7eb; padding:25px; border-radius:16px; box-shadow:0 4px 12px rgba(0,0,0,0.05); transition: all 0.3s ease; cursor: pointer; }
                .why-card:hover { background:#b91c1c !important; color:white !important; transform: translateY(-5px); }
                .why-card:hover p { color:#fecaca !important; }
              `}</style>

              <div className="tracking-head" style={{ background: 'linear-gradient(90deg, #7f1d1d, #b91c1c)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
                <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 15px', borderRadius: '20px', fontSize: '12px' }}>WHY CHOOSE US</span>
                <h1 style={{ fontSize: '42px', margin: '15px 0' }}>Why Achiever Logistics?</h1>
                <p className="sub" style={{ color: '#fecaca' }}>Reliable, Fast & Secure - Delhi ⇄ Pune Daily Service</p>
              </div>

              <div className="tracking-section" style={{ padding: '40px' }}>
                <div className="why-grid">
                  <div className="why-card"><div style={{ fontSize: '32px' }}>⏰</div><h3>98.5% On-Time Delivery</h3><p style={{ color: '#6b7280', fontSize: '14px' }}>We deliver everyday on time. Your business never stops.</p></div>
                  <div className="why-card"><div style={{ fontSize: '32px' }}>📦</div><h3>5000+ Shipments Monthly</h3><p style={{ color: '#6b7280', fontSize: '14px' }}>Trusted by 1000+ businesses across India.</p></div>
                  <div className="why-card"><div style={{ fontSize: '32px' }}>🛡️</div><h3>Safe & Secure Handling</h3><p style={{ color: '#6b7280', fontSize: '14px' }}>100% insured cargo with professional packing.</p></div>
                  <div className="why-card"><div style={{ fontSize: '32px' }}>📍</div><h3>Live Tracking & Support</h3><p style={{ color: '#6b7280', fontSize: '14px' }}>Know exactly where your shipment is, 24/7 support.</p></div>
                  <div className="why-card"><div style={{ fontSize: '32px' }}>🚚</div><h3>Delhi ⇄ Pune Daily Service</h3><p style={{ color: '#6b7280', fontSize: '14px' }}>Daily departure at 8 PM, fast corridor service.</p></div>
                  <div className="why-card"><div style={{ fontSize: '32px' }}>💰</div><h3>Affordable & Transparent</h3><p style={{ color: '#6b7280', fontSize: '14px' }}>No hidden charges, best market price guaranteed.</p></div>
                </div>

                <div style={{ marginTop: '50px', background: '#1e293b', color: 'white', padding: '35px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', maxWidth: '1100px', margin: '50px auto 0 auto' }}>
                  <div>
                    <h2 style={{ margin: '0 0 10px 0', color: '#f87171' }}>🏆 Our Promise</h2>
                    <p style={{ maxWidth: '600px', color: '#cbd5e1' }}>At Achiever Logistics, we don't just move goods, we move your business forward.</p>
                  </div>
                  <button onClick={() => goTo('contact')} style={{ background: '#b91c1c', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Call Now for Booking</button>
                </div>
              </div>
            </div>
          )}

          {/* INDUSTRIES */}
          {active === 'industries' && (
            <div className="industries-section">
              <span className="section-tag">SECTORS WE SERVE</span>
              <h1>Built for Every Industry's Cargo</h1>
              <p className="sub">From heavy machinery to delicate electronics — one logistics partner for it all</p>

              <div className="industry-grid">
                <div className="industry-card">
                  <div className="industry-num">01</div>
                  <div className="industry-icon">🏗️</div>
                  <h3>Construction & Infrastructure</h3>
                  <p>Transport of cement, steel, pipes and heavy construction material to project sites on schedule.</p>
                </div>
                <div className="industry-card">
                  <div className="industry-num">02</div>
                  <div className="industry-icon">🧵</div>
                  <h3>Textile & Garments</h3>
                  <p>Bulk fabric rolls and finished garment consignments moved safely between manufacturing hubs.</p>
                </div>
                <div className="industry-card">
                  <div className="industry-num">03</div>
                  <div className="industry-icon">🌾</div>
                  <h3>Agriculture & FMCG</h3>
                  <p>Time-bound movement of packaged food, grains and fast-moving consumer goods across states.</p>
                </div>
                <div className="industry-card">
                  <div className="industry-num">04</div>
                  <div className="industry-icon">⚙️</div>
                  <h3>Industrial Machinery</h3>
                  <p>Specialized low-bed trailers for heavy plant equipment and factory machinery relocation.</p>
                </div>
                <div className="industry-card">
                  <div className="industry-num">05</div>
                  <div className="industry-icon">🏢</div>
                  <h3>Real Estate & Corporate</h3>
                  <p>Office relocation, corporate shifting and warehousing support for growing businesses.</p>
                </div>
                <div className="industry-card">
                  <div className="industry-num">06</div>
                  <div className="industry-icon">🧴</div>
                  <h3>Chemicals & Industrial Goods</h3>
                  <p>Compliant handling and transport of packaged industrial and chemical goods with proper documentation.</p>
                </div>
                <div className="industry-card">
                  <div className="industry-num">07</div>
                  <div className="industry-icon">🚗</div>
                  <h3>Automobile & Auto Parts</h3>
                  <p>Just-in-time delivery for automotive spare parts, components and assembly-line supplies.</p>
                </div>
                <div className="industry-card highlight">
                  <div className="industry-icon">✓</div>
                  <h3>Why Fleet Owners Trust Us</h3>
                  <p>Owned fleet • Transparent documentation • Multi-state office network • Pan India coverage</p>
                </div>
              </div>

              {/* DIFFERENTIATION BAND */}
              <div className="industry-diff">
                <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}><h4>🚚</h4><p>Owned Fleet, No Broker Delays</p></button>
                <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}><h4>🧾</h4><p>Proper Billing & E-Way Documentation</p></button>
                <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}><h4>🗺️</h4><p>Multi-State Office Coverage</p></button>
                <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}><h4>📞</h4><p>Direct Contractor Support</p></button>
              </div>
              {/* CTA STRIP */}
              <div className="industry-cta">
                <div>
                  <h3>Don't see your industry listed?</h3>
                  <p>We handle custom and specialized cargo too — talk to us directly.</p>
                </div>
                <button onClick={() => setShowQuote(true)}>Get a Custom Quote →</button>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {active === 'about' && (
            <div className="about-section">
              <div className="about-head">
                <span className="badge-pill">ABOUT US</span>
                <h1>{COMPANY_FULL}</h1>
                <p className="tagline">{COMPANY_TAGLINE.toUpperCase()} • PAN INDIA SERVICE NETWORK</p>
              </div>

              <div className="about-grid">
                <div>
                  <h2>Fleet Owners & Transport Contractors, Trusted Pan India</h2>
                  <p>
                    <b>{COMPANY_FULL}</b> operates as a fleet-owning transport contractor offering{' '}
                    <b>all types of transportation & logistics services all over Pan India</b>. Our Admin Office is based
                    in <b>New Delhi</b>, with our Registered Office in <b>Faridabad, Haryana</b>.
                  </p>
                  <p>
                    We run a multi-state branch network — <b>Ahmedabad, Greater Noida, Neemrana, Vapi, Zirakpur</b> and{' '}
                    <b>Pune</b> — so our clients get consistent, on-ground support wherever their cargo needs to move.
                  </p>

                  <div className="route-grid">
                    <div>🏢 Admin Office - New Delhi</div>
                    <div>📋 Registered Office - Faridabad</div>
                    <div>📍 Ahmedabad Branch</div>
                    <div>📍 Greater Noida Branch</div>
                    <div>📍 Neemrana Branch</div>
                    <div>📍 Vapi Branch</div>
                    <div>📍 Zirakpur Branch</div>
                    <div>📍 Pune Branch</div>
                    <div>🇮🇳 Pan India - Available</div>
                  </div>

                  <div className="about-stats">
                    <div><b>8</b><small>Offices</small></div>
                    <div><b>PAN</b><small>INDIA</small></div>
                    <div><b>OWNED</b><small>Fleet</small></div>
                  </div>
                </div>

                <div className="about-card">
                  <h3>Director & Company Details</h3>
                  <div className="director-block">
                    <div className="director-avatar">DK</div>
                    <div>
                      <b>{DIRECTOR_NAME}</b>
                      <span>{DIRECTOR_TITLE} • <a href={`mailto:${DIRECTOR_EMAIL}`}>{DIRECTOR_EMAIL}</a></span>
                    </div>
                  </div>
                  <div className="trust-points">
                    <div>✅ <b>Admin Office:</b> {ADMIN_OFFICE_ADDR}</div>
                    <div>✅ <b>Registered Office:</b> {REGISTERED_OFFICE_ADDR}</div>
                    <div>✅ <b>Website:</b> {WEBSITE}</div>
                    <div>✅ <b>Email:</b> <a href={`mailto:${PRIMARY_EMAIL}`}>{PRIMARY_EMAIL}</a></div>
                  </div>
                  <div className="booking-box">
                    <div className="label">DIRECT BOOKING</div>
                    <div className="name">
                      {DIRECTOR_NAME}
                      <br />
                      <a href={`tel:+91${PRIMARY_PHONE}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        +91 {PRIMARY_PHONE}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {active === 'contact' && (
            <div className="contact-section">
              <div className="contact-head">
                <span className="badge-pill">CONTACT US</span>
                <h1>We're Here to Help</h1>
                <p>Pan India Logistics - 8 Offices, One Network</p>
              </div>

              {/* INDIA MAP - shows whole India by default, zooms in when a branch is clicked */}
              <div className="map-wrap">
                <div className="map-header">
                  <div>
                    <h3>{selectedBranch ? `📍 ${selectedBranch}` : '📍 Our Pan India Network'}</h3>
                    {selectedBranch && (
                      <p className="map-address">
                        {branches.find((b) => b.city === selectedBranch)?.addr}
                      </p>
                    )}
                  </div>
                  {selectedBranch && (
                    <button className="map-reset" onClick={() => { setSelectedBranch(null); setMapSrc(indiaMapSrc); }}>
                      ← Show Full India Map
                    </button>
                  )}
                </div>
                <iframe
                  title="Achiever Logistics Branch Map"
                  src={mapSrc}
                  width="100%"
                  height="420"
                  style={{ border: 0, borderRadius: '16px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* CLICKABLE OFFICE LIST - click any office to open it on the map above */}
              <div className="branch-click-grid">
                {branches.map((b) => (
                  <div
                    key={b.city}
                    className={`branch-click-card ${selectedBranch === b.city ? 'active' : ''}`}
                    onClick={() => openBranchOnMap(b)}
                  >
                    <div className="branch-pin">📍</div>
                    <span className="branch-tag">{b.tag}</span>
                    <h4>{b.city}</h4>
                    <p>{b.addr}</p>
                    <span className="view-link">View on map →</span>
                  </div>
                ))}
              </div>

              <div className="contact-grid">
                <div className="contact-office">
                  <div className="office-top">
                    <span className="office-icon">A</span>
                    <b>ADMIN OFFICE - NEW DELHI</b>
                  </div>
                  <h2>{COMPANY_FULL}</h2>
                  <p>{ADMIN_OFFICE_ADDR}</p>
                  <p style={{ marginTop: '10px' }}>
                    {OFFICE_PHONES.map((p, i) => (
                      <span key={p}>
                        <a href={`tel:${p.replace(/-/g, '')}`} className="inline-phone">{p}</a>
                        {i < OFFICE_PHONES.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </p>
                  <div className="office-actions">
                    <a href={`tel:+91${PRIMARY_PHONE}`}>📞 +91 {PRIMARY_PHONE}</a>
                    <a href={`https://wa.me/91${PRIMARY_PHONE}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>
                  </div>
                  <div className="office-actions" style={{ marginTop: '10px' }}>
                    <a href={`mailto:${PRIMARY_EMAIL}`}>✉ {PRIMARY_EMAIL}</a>
                  </div>
                </div>
                <div className="contact-form-box">
                  <h3>Send Us Your Details</h3>
                  <form onSubmit={sendQuote}>
                    <input name="name" placeholder="Your Name" required />
                    <input name="phone" type="tel" placeholder="Phone Number" required />
                    <input name="email" type="email" placeholder="Email Address" required />
                    <input name="address" placeholder="Pickup / Delivery Address" required />
                    <button type="submit">Send via WhatsApp</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h3>ACHIEVER LOGISTICS</h3>
            <p>{COMPANY_TAGLINE} • Pan India logistics network.</p>
            <p>🌐 <a href={`https://${WEBSITE}`} target="_blank" rel="noreferrer">{WEBSITE}</a></p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <span onClick={() => goTo('services')}>Services</span>
            <span onClick={() => goTo('why-us')}>Why-Us</span>
            <span onClick={() => goTo('industries')}>Industries</span>
            <span onClick={() => goTo('about')}>About Us</span>
            <span onClick={() => goTo('contact')}>Contact</span>
          </div>
          <div>
            <h4>Admin Office - New Delhi</h4>
            <p>{ADMIN_OFFICE_ADDR}</p>
            <p><a href={`tel:+91${PRIMARY_PHONE}`}>📞 +91 {PRIMARY_PHONE}</a></p>
            <p><a href={`mailto:${PRIMARY_EMAIL}`}>✉ {PRIMARY_EMAIL}</a></p>
          </div>
          <div>
            <h4>Our Branches</h4>
            <p>Ahmedabad • Greater Noida</p>
            <p>Neemrana • Vapi • Zirakpur • Pune </p>
            <p style={{ marginTop: '8px' }}>Registered Office: Faridabad, Haryana</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 {COMPANY_FULL}. All Rights Reserved.</div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/91${PRIMARY_PHONE}`}
        target="_blank"
        rel="noreferrer"
        className="float-whatsapp"
        aria-label="WhatsApp"
      >
        💬
      </a>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* GET A QUOTE MODAL */}
      {showQuote && (
        <div className="modal-overlay" onClick={() => setShowQuote(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Get a Free Quote</h3>
            <form onSubmit={sendQuote}>
              <input name="name" placeholder="Your Name" required />
              <input name="phone" type="tel" placeholder="Phone Number" required />
              <input name="email" type="email" placeholder="Email Address" required />
              <input name="address" placeholder="Pickup / Delivery Address" required />
              <button type="submit">Submit</button>
            </form>
            <button className="modal-close" onClick={() => setShowQuote(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;