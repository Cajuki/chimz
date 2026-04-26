import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, MapPin, Award, Truck } from 'lucide-react';
import './AboutPage.css';

const TEAM = [
  { name: 'Dr. Samuel Kariuki', role: 'Chief Executive Officer', init: 'SK' },
  { name: 'Amina Hassan', role: 'Head of Sales & Partnerships', init: 'AH' },
  { name: 'Eng. Peter Mwangi', role: 'Technical Director', init: 'PM' },
  { name: 'Grace Wambui', role: 'Customer Relations Manager', init: 'GW' },
];

const VALUES = [
  { icon: <Award size={28} />, title: 'Quality Assurance', desc: 'Every product we supply meets international standards — ISO, CE, and KEBS certified.' },
  { icon: <Users size={28} />, title: 'Customer First', desc: 'We build lasting relationships with healthcare institutions by prioritizing their needs.' },
  { icon: <MapPin size={28} />, title: 'Local Expertise', desc: 'Deep knowledge of Kenya\'s healthcare landscape and regulatory environment.' },
  { icon: <Truck size={28} />, title: 'Reliable Delivery', desc: 'Nationwide logistics network ensuring timely delivery to all 47 counties.' },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="container page-hero-content">
          <p className="section-label">Our Story</p>
          <h1>About Medithrex</h1>
          <p>Empowering Kenya's healthcare sector with world-class medical and laboratory equipment since 2009.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="section about-mission">
        <div className="container about-mission-grid">
          <div className="mission-img">
            <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=700&q=80" alt="Medical equipment" />
            <div className="mission-badge">
              <span className="mission-badge-num">15+</span>
              <span>Years of Excellence</span>
            </div>
          </div>
          <div className="mission-content">
            <p className="section-label">Who We Are</p>
            <h2 className="section-title">Kenya's Trusted Medical Equipment Partner</h2>
            <div className="divider" />
            <p>Medithrex Medical Solutions is a leading supplier of medical and laboratory equipment to hospitals, clinics, diagnostic centers, universities, and research institutions across Kenya and East Africa.</p>
            <p>Founded in Nairobi in 2009, we have grown from a small distributor to a comprehensive medical equipment solutions provider, serving over 200 institutions in all 47 counties of Kenya.</p>
            <div className="mission-checks">
              {['MOH Registered Supplier', 'KEBS Certified Products', 'ISO 9001 Quality Management', 'Trained Technical Team', 'After-Sales & Maintenance'].map(c => (
                <div key={c} className="mission-check"><CheckCircle size={16} /> {c}</div>
              ))}
            </div>
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Get In Touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-bar">
        <div className="container about-stats-grid">
          {[
            { val: '200+', label: 'Institutions Served' },
            { val: '1,500+', label: 'Products Supplied' },
            { val: '47', label: 'Counties Reached' },
            { val: '15+', label: 'Years Experience' },
            { val: '98%', label: 'Client Satisfaction' },
          ].map(s => (
            <div key={s.label} className="about-stat">
              <span className="about-stat-val">{s.val}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section values-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="section-label">What Drives Us</p>
            <h2 className="section-title">Our Core Values</h2>
            <div className="divider divider-center" />
          </div>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section team-section">
        <div className="container">
          <div style={{ marginBottom: '40px' }}>
            <p className="section-label">The People Behind Medithrex</p>
            <h2 className="section-title">Our Leadership Team</h2>
            <div className="divider" />
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-avatar">{m.init}</div>
                <h4>{m.name}</h4>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container about-cta-inner">
          <div>
            <h2>Ready to Equip Your Facility?</h2>
            <p>Contact us today for a consultation and customized quote.</p>
          </div>
          <div className="about-cta-btns">
            <Link to="/quote" className="btn btn-primary btn-lg">Request a Quote <ArrowRight size={18} /></Link>
            <Link to="/products" className="btn btn-outline-white btn-lg">Browse Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
