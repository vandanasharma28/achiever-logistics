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
const PRIMARY_PHONE = '9999844421'; // Director's mobile - used for calls / WhatsApp
const OFFICE_PHONES = ['011-45684179', '9582220782', '9319607878'];
const PRIMARY_EMAIL = 'info@alcpl.co.in';
const DIRECTOR_EMAIL = 'Dinesh@alcpl.co.in';
const WEBSITE = 'www.alcpl.co.in';
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


  // Real offices from the company visiting card
  const branches = [
    { city: 'New Delhi', tag: 'Admin Office', addr: ADMIN_OFFICE_ADDR, lat: 28.5136, lng: 77.2831 },
    { city: 'Faridabad', tag: 'Registered Office', addr: REGISTERED_OFFICE_ADDR, lat: 28.3670, lng: 77.3060 },
    { city: 'Ahmedabad', tag: 'Branch Office', addr: 'J-502, 5th Floor, Umang 4, Nr. Laxminagar Society, Rangolinagar, Narol, Ahmedabad, Gujarat - 382405', lat: 22.9660, lng: 72.6130 },
    { city: 'Greater Noida', tag: 'Branch Office', addr: 'Village Devla, Surajpur, UPSIDC, Greater Noida, Uttar Pradesh - 201311', lat: 28.4744, lng: 77.5040 },
    { city: 'Neemrana', tag: 'Branch Office', addr: 'Shop No. 4, 2nd Floor, R-Tech Mall, Nr. Krishna Tower, Neemrana, Alwar, Rajasthan - 301705', lat: 27.9877, lng: 76.3838 },
    { city: 'Vapi', tag: 'Branch Office', addr: 'Office No. 601, 6th Floor, Skylon Building, Near Vapi Char Rasta, Vapi Daman Road, Gujarat - 396191', lat: 20.3893, lng: 72.9106 },
    { city: 'Zirakpur', tag: 'Branch Office', addr: 'Godown Area, Village Bhabhat, Zirakpur, Distt. Mohali, Punjab - 140603', lat: 30.6425, lng: 76.8173 },
     { city: 'Pune', tag: 'Branch Office', addr: 'Pimpri-Chinchwad, Near Tata Motors, Pune-Nashik Highway, Pune - 411019', lat: 18.6186, lng: 73.8037 },
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
          <span className="top-bar-website">🌐 {WEBSITE}</span>
        </div>
        <div className="top-bar-right">
        
        </div>
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
          <span className={active === 'home' ? 'on' : ''} onClick={() => goTo('home')}>Home</span>
          <span className={active === 'services' ? 'on' : ''} onClick={() => goTo('services')}>Services</span>
          <span className={active === 'why-us' ? 'on' : ''} onClick={() => goTo('why-us')}>Why Us</span>
          <span className={active === 'industries' ? 'on' : ''} onClick={() => goTo('industries')}>Industries</span>
          <span className={active === 'about' ? 'on' : ''} onClick={() => goTo('about')}>About Us</span>
          <span className={active === 'contact' ? 'on' : ''} onClick={() => goTo('contact')}>Contact</span>
          <button className="quote-btn" onClick={() => setShowQuote(true)}>Get a Quote</button>
        </nav>
      </header>

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
  <div className="highlight-item" onClick={() => window.scrollTo({top: 900, behavior: 'smooth'})} style={{cursor:'pointer'}}>
    <span className="hi-icon">🚛</span>
    <p>Owned Fleet, No Broker Delays</p>
  </div>
  <div className="highlight-item" onClick={() => window.scrollTo({top: 900, behavior: 'smooth'})} style={{cursor:'pointer'}}>
    <span className="hi-icon">📄</span>
    <p>Transparent Billing & Documentation</p>
  </div>
  <div className="highlight-item" onClick={() => window.scrollTo({top: 1500, behavior: 'smooth'})} style={{cursor:'pointer'}}>
    <span className="hi-icon">🏢</span>
    <p>8 Offices Across Pan India</p>
  </div>
  <div className="highlight-item" onClick={() => window.scrollTo({top: 2500, behavior: 'smooth'})} style={{cursor:'pointer'}}>
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
              <div className="quote-mark">“</div>
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

  <div className="tracking-head" style={{background:'linear-gradient(90deg, #7f1d1d, #b91c1c)', padding:'60px 20px', textAlign:'center', color:'white'}}>
    <span className="section-tag" style={{background:'rgba(255,255,255,0.2)', padding:'6px 15px', borderRadius:'20px', fontSize:'12px'}}>WHY CHOOSE US</span>
    <h1 style={{fontSize:'42px', margin:'15px 0'}}>Why Achiever Logistics?</h1>
    <p className="sub" style={{color:'#fecaca'}}>Reliable, Fast & Secure - Delhi ⇄ Pune Daily Service</p>
  </div>

  <div className="tracking-section" style={{padding:'40px'}}>
    <div className="why-grid">
      <div className="why-card"><div style={{fontSize:'32px'}}>⏰</div><h3>98.5% On-Time Delivery</h3><p style={{color:'#6b7280', fontSize:'14px'}}>We deliver everyday on time. Your business never stops.</p></div>
      <div className="why-card"><div style={{fontSize:'32px'}}>📦</div><h3>5000+ Shipments Monthly</h3><p style={{color:'#6b7280', fontSize:'14px'}}>Trusted by 1000+ businesses across India.</p></div>
      <div className="why-card"><div style={{fontSize:'32px'}}>🛡️</div><h3>Safe & Secure Handling</h3><p style={{color:'#6b7280', fontSize:'14px'}}>100% insured cargo with professional packing.</p></div>
      <div className="why-card"><div style={{fontSize:'32px'}}>📍</div><h3>Live Tracking & Support</h3><p style={{color:'#6b7280', fontSize:'14px'}}>Know exactly where your shipment is, 24/7 support.</p></div>
      <div className="why-card"><div style={{fontSize:'32px'}}>🚚</div><h3>Delhi ⇄ Pune Daily Service</h3><p style={{color:'#6b7280', fontSize:'14px'}}>Daily departure at 8 PM, fast corridor service.</p></div>
      <div className="why-card"><div style={{fontSize:'32px'}}>💰</div><h3>Affordable & Transparent</h3><p style={{color:'#6b7280', fontSize:'14px'}}>No hidden charges, best market price guaranteed.</p></div>
    </div>

    <div style={{marginTop:'50px', background:'#1e293b', color:'white', padding:'35px', borderRadius:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'20px', maxWidth:'1100px', margin:'50px auto 0 auto'}}>
      <div>
        <h2 style={{margin:'0 0 10px 0', color:'#f87171'}}>🏆 Our Promise</h2>
        <p style={{maxWidth:'600px', color:'#cbd5e1'}}>At Achiever Logistics, we don't just move goods, we move your business forward.</p>
      </div>
      <button onClick={() => goTo('contact')} style={{background:'#b91c1c', color:'white', border:'none', padding:'14px 28px', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Call Now for Booking</button>
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
  <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({behavior:'smooth'})} style={{cursor:'pointer'}}><h4>🚚</h4><p>Owned Fleet, No Broker Delays</p></button>
  <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({behavior:'smooth'})} style={{cursor:'pointer'}}><h4>🧾</h4><p>Proper Billing & E-Way Documentation</p></button>
  <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({behavior:'smooth'})} style={{cursor:'pointer'}}><h4>🗺️</h4><p>Multi-State Office Coverage</p></button>
  <button className="diff-item" type="button" onClick={() => document.querySelector('.site-footer')?.scrollIntoView({behavior:'smooth'})} style={{cursor:'pointer'}}><h4>📞</h4><p>Direct Contractor Support</p></button>
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