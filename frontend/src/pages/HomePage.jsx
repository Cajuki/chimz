import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, CheckCircle, Phone, Star, Shield, Truck, Headphones, Award, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import './HomePage.css';

const HERO_SLIDES = [
  {
    title: 'Advanced Medical Equipment for Kenya',
    sub: 'Supplying hospitals, clinics, and labs with world-class diagnostic, surgical, and laboratory equipment.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&q=80',
    cta: 'Browse Products', ctaLink: '/products',
    cta2: 'Request a Quote', cta2Link: '/quote'
  },
  {
    title: 'Laboratory Solutions Built for Precision',
    sub: 'From hematology analyzers to PCR machines — equip your lab with certified, reliable instruments.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1400&q=80',
    cta: 'View Lab Equipment', ctaLink: '/products?category=Laboratory+Equipment',
    cta2: 'Contact Us', cta2Link: '/contact'
  },
  {
    title: 'Trusted by Healthcare Institutions Across East Africa',
    sub: 'Over 200 institutions rely on Medithrex for quality equipment, fast delivery, and after-sales support.',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1400&q=80',
    cta: 'Get a Quote Today', ctaLink: '/quote',
    cta2: 'Our Story', cta2Link: '/about'
  }
];

const CATEGORIES = [
  { name: 'Diagnostic Equipment', icon: '🔬', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400' },
  { name: 'Laboratory Equipment', icon: '🧪', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400' },
  { name: 'Surgical Instruments', icon: '🏥', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400' },
  { name: 'Patient Monitoring', icon: '📊', image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400' },
  { name: 'Imaging Equipment', icon: '📡', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400' },
  { name: 'Consumables & Supplies', icon: '📦', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400' },
  { name: 'Rehabilitation Equipment', icon: '🦽', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
  { name: 'Dental Equipment', icon: '🦷', image: 'https://images.unsplash.com/photo-1609207807107-e8e3fb78f4d3?w=400' },
];

const STATS = [
  { value: '200+', label: 'Institutions Served' },
  { value: '1,500+', label: 'Products Available' },
  { value: '15+', label: 'Years Experience' },
  { value: '47', label: 'Kenyan Counties' },
];

const BRANDS = ['Philips', 'GE Healthcare', 'Mindray', 'Karl Storz', 'Siemens', 'Medtronic', 'Abbott', 'Roche'];

const WHY_US = [
  { icon: <Shield size={28} />, title: 'Genuine Products', desc: 'All equipment comes with manufacturer certification and full warranty.' },
  { icon: <Truck size={28} />, title: 'Nationwide Delivery', desc: 'Fast, reliable delivery to all 47 counties across Kenya.' },
  { icon: <Headphones size={28} />, title: 'After-Sales Support', desc: 'Dedicated technical team for installation, training, and maintenance.' },
  { icon: <Award size={28} />, title: 'Competitive Pricing', desc: 'Best market rates with flexible payment options including M-Pesa and invoicing.' },
];

const TESTIMONIALS = [
  { name: 'Dr. Wanjiru Kamau', role: 'Medical Director, Nairobi Clinic', text: 'Medithrex delivered our entire ICU setup on time and within budget. Their after-sales support has been exceptional.' },
  { name: 'Lab Manager Otieno', role: 'Kenyatta National Hospital', text: 'We\'ve sourced our hematology and chemistry analyzers from Medithrex for years. Reliable equipment, genuine parts.' },
  { name: 'Dr. Aisha Mohammed', role: 'Owner, Coastal Medical Centre', text: 'The quote-to-delivery process was seamless. Highly professional team that understands the Kenyan healthcare context.' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=8')
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${current.image})` }} />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-label">Kenya's Medical Equipment Partner</div>
            <h1 className="hero-title">{current.title}</h1>
            <p className="hero-sub">{current.sub}</p>
            <div className="hero-actions">
              <Link to={current.ctaLink} className="btn btn-primary btn-lg">{current.cta} <ArrowRight size={18} /></Link>
              <Link to={current.cta2Link} className="btn btn-outline-white btn-lg">{current.cta2}</Link>
            </div>
            <div className="hero-trust">
              {['ISO Certified', 'KEBS Approved', 'Warranty Guaranteed'].map(t => (
                <span key={t}><CheckCircle size={14} /> {t}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Slide dots */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot${i === slide ? ' active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
        {/* Contact CTA */}
        <a href="tel:0790080903" className="hero-call">
          <Phone size={16} /> 0790 080 903
        </a>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="container stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-label">What We Offer</p>
              <h2 className="section-title">Equipment Categories</h2>
              <div className="divider" />
            </div>
            <Link to="/products" className="btn btn-outline">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`} className="cat-card">
                <div className="cat-card-img">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="cat-card-overlay" />
                </div>
                <div className="cat-card-body">
                  <span className="cat-card-name">{cat.name}</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-label">Hand-Picked Selection</p>
              <h2 className="section-title">Featured Products</h2>
              <div className="divider" />
            </div>
            <Link to="/products" className="btn btn-outline">All Products <ArrowRight size={16} /></Link>
          </div>
          {loadingProducts ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <p className="section-label">Why Choose Medithrex</p>
              <h2 className="section-title">Your Trusted Healthcare Equipment Partner</h2>
              <div className="divider" />
              <p className="why-desc">Since 2009, Medithrex has been the go-to supplier for hospitals, clinics, diagnostic labs, and healthcare institutions across Kenya and East Africa. We combine global-standard equipment with local market expertise.</p>
              <div className="why-checks">
                {['MOH Approved Supplier', 'Flexible Payment Terms', 'Engineer Installation Included', 'Staff Training Provided'].map(c => (
                  <div key={c} className="why-check"><CheckCircle size={18} /> {c}</div>
                ))}
              </div>
              <Link to="/about" className="btn btn-dark" style={{ marginTop: '24px' }}>Learn More About Us <ArrowRight size={16} /></Link>
            </div>
            <div className="why-right">
              {WHY_US.map(w => (
                <div key={w.title} className="why-card">
                  <div className="why-card-icon">{w.icon}</div>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE CTA BANNER */}
      <section className="quote-banner">
        <div className="container quote-banner-inner">
          <div className="quote-banner-text">
            <h2>Need Custom Equipment for Your Facility?</h2>
            <p>We supply single units to full hospital setups. Get a tailored quote within 24 hours.</p>
          </div>
          <div className="quote-banner-actions">
            <Link to="/quote" className="btn btn-primary btn-lg">Request a Quote <ArrowRight size={18} /></Link>
            <a href="tel:0790080903" className="btn btn-outline-white btn-lg"><Phone size={18} /> 0790 080 903</a>
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="section brands-section">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center' }}>Brands We Carry</p>
          <div className="brands-row">
            {BRANDS.map(b => <div key={b} className="brand-chip">{b}</div>)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <p className="section-label">What Clients Say</p>
          <h2 className="section-title">Trusted by Healthcare Professionals</h2>
          <div className="divider" />
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}{t.name.split(' ')[1]?.[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
