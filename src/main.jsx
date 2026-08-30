import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const barbers = [
  { id: 1, name: 'Marcus Reed', initials: 'MR', specialty: 'Modern fades & beard sculpting', rating: 4.9, reviews: 128, price: 42, distance: '0.8 mi', color: '#dbeafe', available: true },
  { id: 2, name: 'Jasmine Cole', initials: 'JC', specialty: 'Texture, curls & creative cuts', rating: 5.0, reviews: 86, price: 48, distance: '1.4 mi', color: '#fce7f3', available: true },
  { id: 3, name: 'Andre Williams', initials: 'AW', specialty: 'Classic cuts & hot towel shaves', rating: 4.8, reviews: 203, price: 38, distance: '2.1 mi', color: '#dcfce7', available: false }
];
const seedBooking = { barber: barbers[0], service: 'Signature Fade', date: 'Sat, Aug 31', time: '10:30 AM', address: '24 Willow St, Brooklyn', status: 'Confirmed', id: 'HC-2048' };

function App() {
  const [view, setView] = useState('home');
  const [booking, setBooking] = useState(seedBooking);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [bookStep, setBookStep] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600); };

  const nav = (v) => { setView(v); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const confirmBooking = () => {
    setBooking({ ...booking, barber: selectedBarber, service: 'Signature Fade', status: 'Confirmed', id: 'HC-' + Math.floor(2000 + Math.random() * 7000) });
    setBookStep(3); notify('Booking confirmed — check your notifications');
  };

  return <div className="app">
    <header className="topbar">
      <button className="brand" onClick={() => nav('home')}><span className="brand-mark">✦</span> Home<span>Cuts</span></button>
      <nav className="navlinks">
        <button className={view === 'home' ? 'active' : ''} onClick={() => nav('home')}>Find a barber</button>
        <button className={view === 'bookings' ? 'active' : ''} onClick={() => nav('bookings')}>My bookings</button>
        <button className={view === 'barber' ? 'active' : ''} onClick={() => nav('barber')}>For barbers</button>
        <button className={view === 'admin' ? 'active' : ''} onClick={() => nav('admin')}>Admin</button>
      </nav>
      <div className="header-actions"><button className="icon-btn" onClick={() => notify('You have 2 new notifications')}>♢<i></i></button><button className="avatar small" onClick={() => setModal('auth')}>JD</button></div>
    </header>
    <main>
      {view === 'home' && <Home selected={selectedBarber} setSelected={setSelectedBarber} onBook={() => { setBookStep(0); setModal('booking'); }} />}
      {view === 'bookings' && <Bookings booking={booking} onReview={() => setModal('review')} onReschedule={() => { setModal('booking'); setBookStep(1); }} />}
      {view === 'barber' && <BarberDashboard notify={notify} />}
      {view === 'admin' && <AdminPanel notify={notify} />}
    </main>
    <footer><div><span className="brand-mark">✦</span> HomeCuts</div><span>Local barbers. Better days.</span><span>© 2024 HomeCuts</span></footer>
    {modal === 'auth' && <Auth onClose={() => setModal(null)} onDone={() => { setModal(null); notify('Welcome back, Jordan!'); }} />}
    {modal === 'booking' && <BookingModal step={bookStep} setStep={setBookStep} barber={selectedBarber} confirm={confirmBooking} close={() => setModal(null)} notify={notify} />}
    {modal === 'review' && <ReviewModal close={() => setModal(null)} reviewed={reviewed} setReviewed={setReviewed} notify={notify} />}
    {toast && <div className="toast">✓ {toast}</div>}
  </div>;
}

function Home({ selected, setSelected, onBook }) {
  return <div className="container">
    <section className="hero"><div><p className="eyebrow">THE NEW STANDARD OF GROOMING</p><h1>Your best look,<br /><em>at your door.</em></h1><p className="hero-copy">Book trusted local barbers who bring the studio experience to your home, office, or hotel.</p><div className="searchbar"><span>⌕</span><input defaultValue="Brooklyn, NY" aria-label="Location" /><button onClick={onBook}>Find a barber <b>→</b></button></div><div className="trust"><span>★★★★★</span> <strong>4.9/5</strong> from 2,000+ happy clients</div></div><div className="hero-art"><div className="sun"></div><div className="hero-card"><span className="tag">TOP RATED</span><div className="avatar large">MR</div><strong>Marcus Reed</strong><small>Specialist in modern fades</small><div className="stars">★★★★★ <span>4.9</span></div></div><div className="scissors">✂</div></div></section>
    <section className="section-head"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Barbers near you</h2></div><button className="text-btn">View all <b>→</b></button></section>
    <div className="barber-grid">{barbers.map(b => <article className={'barber-card ' + (selected.id === b.id ? 'chosen' : '')} key={b.id} onClick={() => setSelected(b)}><div className="card-top"><div className="avatar" style={{ background: b.color }}>{b.initials}</div><span className={b.available ? 'available' : 'offline'}>{b.available ? '● Available today' : 'Next available Mon'}</span></div><h3>{b.name}</h3><p>{b.specialty}</p><div className="card-meta"><span>★ {b.rating} <small>({b.reviews})</small></span><span>⌖ {b.distance}</span></div><div className="card-bottom"><strong>From ${b.price}</strong><button onClick={(e) => { e.stopPropagation(); setSelected(b); onBook(); }}>Book now <b>→</b></button></div></article>)}</div>
    <section className="how"><p className="eyebrow">HOW IT WORKS</p><h2>Good grooming, made simple.</h2><div className="steps"><div><b>01</b><h3>Choose your craft</h3><p>Browse verified barbers and find your perfect match.</p></div><div><b>02</b><h3>Pick a time & place</h3><p>We come to you, whenever and wherever you need.</p></div><div><b>03</b><h3>Leave looking sharp</h3><p>Enjoy a premium service with no salon small talk.</p></div></div></section>
  </div>;
}

function Bookings({ booking, onReview, onReschedule }) {
  return <div className="container page"><div className="page-title"><div><p className="eyebrow">WELCOME BACK, JORDAN</p><h1>Your bookings</h1></div><button className="primary" onClick={onReschedule}>+ Book a new cut</button></div><div className="booking-layout"><section className="panel"><div className="panel-head"><h2>Upcoming</h2><span className="pill green">● {booking.status}</span></div><div className="booking-main"><div className="datebox"><b>31</b><span>AUG</span></div><div><h3>{booking.service}</h3><p>with <strong>{booking.barber.name}</strong> · {booking.time}</p><p className="muted">⌖ {booking.address}</p></div><div className="booking-actions"><button className="outline" onClick={onReschedule}>Reschedule</button><button className="ghost">Cancel</button></div></div><div className="timeline"><div className="done">✓<span>Requested</span></div><div className="done">✓<span>Confirmed</span></div><div><span className="dot"></span><span>Barber en route</span></div><div><span className="dot"></span><span>Completed</span></div></div></section><aside className="panel summary"><p className="eyebrow">BOOKING SUMMARY</p><div className="summary-row"><span>Service</span><strong>{booking.service}</strong></div><div className="summary-row"><span>Duration</span><strong>45 min</strong></div><div className="summary-row"><span>Service total</span><strong>$42.00</strong></div><div className="summary-row"><span>HomeCuts fee</span><strong>$4.20</strong></div><hr /><div className="summary-row total"><span>Total paid</span><strong>$46.20</strong></div><p className="receipt">Paid with •••• 4242</p></aside></div><section className="past"><div className="section-head"><h2>Past visits</h2><button className="text-btn">View history →</button></div><div className="past-row"><div className="avatar" style={{ background: '#dbeafe' }}>MR</div><div><strong>Skin Fade + Beard</strong><p>Marcus Reed · Aug 10, 2024</p></div><span className="stars">★★★★★</span><button className="outline" onClick={onReview}>Review</button></div></section></div>;
}

function BarberDashboard({ notify }) {
  return <div className="container page"><div className="page-title"><div><p className="eyebrow">BARBER STUDIO</p><h1>Good morning, Marcus.</h1></div><button className="primary" onClick={() => notify('Availability updated')}>Manage availability</button></div><div className="stats"><div><span>Today’s earnings</span><strong>$186.00</strong><small>↑ 12% vs last week</small></div><div><span>Upcoming appointments</span><strong>5</strong><small>2 new requests</small></div><div><span>Average rating</span><strong>4.9 <span className="stars">★</span></strong><small>128 reviews</small></div></div><div className="dashboard-grid"><section className="panel"><div className="panel-head"><h2>Today · Saturday, Aug 31</h2><span className="pill">5 appointments</span></div>{[['09:00 AM','Jordan Davis','Signature Fade','Confirmed'],['10:30 AM','Sam Wilson','Skin Fade + Beard','Confirmed'],['01:00 PM','Nina Patel','Classic Scissor Cut','New request']].map((x,i)=><div className="appt" key={x[0]}><time>{x[0]}</time><div className="avatar" style={{background:i===2?'#fef3c7':'#e0e7ff'}}>{x[1].split(' ').map(a=>a[0]).join('')}</div><div><strong>{x[1]}</strong><p>{x[2]}</p></div><span className={'pill '+(i===2?'yellow':'green')}>{x[3]}</span><button className="kebab" onClick={() => notify('Appointment options opened')}>•••</button></div>)}</section><section className="panel"><div className="panel-head"><h2>Profile preview</h2><button className="text-btn" onClick={() => notify('Profile editor opened')}>Edit</button></div><div className="profile-preview"><div className="avatar large">MR</div><h3>Marcus Reed</h3><p>Modern fades & beard sculpting</p><div className="stars">★★★★★ <span>4.9 (128)</span></div><div className="profile-tags"><span>Fade specialist</span><span>5 years experience</span></div></div></section></div></div>;
}

function AdminPanel({ notify }) {
  return <div className="container page"><div className="page-title"><div><p className="eyebrow">OPERATIONS</p><h1>Admin overview</h1></div><button className="outline" onClick={() => notify('Report exported as CSV')}>↓ Export report</button></div><div className="stats"><div><span>Gross bookings</span><strong>$24,820</strong><small className="up">↑ 18.4% this month</small></div><div><span>Active customers</span><strong>1,284</strong><small className="up">↑ 9.2% this month</small></div><div><span>Pending applications</span><strong>12</strong><small>Needs review</small></div></div><section className="panel table-panel"><div className="panel-head"><h2>Recent barber applications</h2><button className="text-btn">View all →</button></div><div className="table">{[['Elena Rodriguez','Brooklyn, NY','Aug 30','Review'],['Devon Price','Queens, NY','Aug 29','Review'],['Maya Chen','Manhattan, NY','Aug 28','Approved']].map((r,i)=><div className="table-row" key={r[0]}><div className="avatar" style={{background:['#fce7f3','#ede9fe','#dcfce7'][i]}}>{r[0].split(' ').map(a=>a[0]).join('')}</div><strong>{r[0]}</strong><span>{r[1]}</span><span>{r[2]}</span><button className={i===2?'pill green':'outline'} onClick={() => notify(i===2?'Application already approved':'Application review opened')}>{r[3]}</button></div>)}</div></section></div>;
}

function Auth({ onClose, onDone }) { return <div className="overlay"><div className="modal auth"><button className="close" onClick={onClose}>×</button><span className="brand-mark">✦</span><h2>Welcome to HomeCuts</h2><p>Sign in to manage your appointments.</p><button className="social">G Continue with Google</button><div className="or">or</div><input placeholder="Email address" type="email" defaultValue="jordan@example.com" /><button className="primary full" onClick={onDone}>Continue</button><small>By continuing, you agree to our Terms and Privacy Policy.</small></div></div>; }

function BookingModal({ step, setStep, barber, confirm, close, notify }) { const dates=['Fri, Aug 30','Sat, Aug 31','Sun, Sep 1']; return <div className="overlay"><div className="modal booking-modal"><button className="close" onClick={close}>×</button>{step === 0 && <><p className="eyebrow">STEP 1 OF 3</p><h2>Choose your service</h2><div className="selected-barber"><div className="avatar" style={{background: barber.color}}>{barber.initials}</div><div><strong>{barber.name}</strong><p>{barber.specialty}</p></div><span>★ {barber.rating}</span></div>{['Signature Fade','Skin Fade + Beard','Classic Scissor Cut'].map((s,i)=><button className={'service '+(i===0?'selected':'')} onClick={() => setStep(1)} key={s}><span><b>{s}</b><small>{i===0?'Precision fade, line-up & finish':i===1?'Fade, beard sculpt & hot towel':'Scissor cut, wash & style'}</small></span><strong>${[42,58,38][i]}</strong></button>)}<button className="primary full" onClick={() => setStep(1)}>Continue <b>→</b></button></>}{step === 1 && <><p className="eyebrow">STEP 2 OF 3</p><h2>Pick a time</h2><div className="date-tabs">{dates.map((d,i)=><button className={i===1?'selected':''} key={d}>{d}</button>)}</div><div className="time-grid">{['9:00 AM','10:30 AM','12:00 PM','1:30 PM','3:00 PM','4:30 PM'].map((t,i)=><button className={i===1?'selected':''} key={t}>{t}</button>)}</div><button className="primary full" onClick={() => setStep(2)}>Continue <b>→</b></button></>}{step === 2 && <><p className="eyebrow">STEP 3 OF 3</p><h2>Confirm & pay</h2><div className="checkout"><div><span>Service</span><strong>Signature Fade</strong></div><div><span>When</span><strong>Sat, Aug 31 · 10:30 AM</strong></div><div><span>Where</span><strong>24 Willow St, Brooklyn</strong></div><hr /><div><span>Total</span><strong>$46.20</strong></div></div><div className="payment">▣ &nbsp; •••• 4242 <span>Change</span></div><button className="primary full" onClick={confirm}>Pay $46.20 & confirm</button></>}{step === 3 && <div className="success"><div className="success-icon">✓</div><h2>You're all set!</h2><p>We've sent the details to your email and notifications.</p><button className="primary full" onClick={close}>Done</button></div>}</div></div>; }

function ReviewModal({ close, reviewed, setReviewed, notify }) { return <div className="overlay"><div className="modal review"><button className="close" onClick={close}>×</button><p className="eyebrow">SHARE YOUR EXPERIENCE</p><h2>How was your cut?</h2><div className="review-barber"><div className="avatar" style={{background:'#dbeafe'}}>MR</div><strong>Marcus Reed</strong></div><div className="rating-select">{[1,2,3,4,5].map(n=><button key={n} onClick={() => setReviewed(true)} className={reviewed || n < 5 ? 'on':''}>★</button>)}</div><textarea placeholder="Tell us what you loved (optional)"></textarea><button className="primary full" onClick={() => { setReviewed(true); notify('Thanks for your review!'); close(); }}>{reviewed ? 'Review submitted' : 'Submit review'}</button></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
