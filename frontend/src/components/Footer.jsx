import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-text">MEDITHREX</span>
              <span className="footer-logo-sub">MEDICAL SOLUTIONS</span>
            </div>
            <p>Kenya's premier supplier of medical and laboratory equipment. Delivering quality, reliability, and innovation to healthcare institutions across East Africa.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/"><ArrowRight size={12} /> Home</Link></li>
              <li><Link to="/products"><ArrowRight size={12} /> Products</Link></li>
              <li><Link to="/quote"><ArrowRight size={12} /> Request a Quote</Link></li>
              <li><Link to="/about"><ArrowRight size={12} /> About Us</Link></li>
              <li><Link to="/contact"><ArrowRight size={12} /> Contact</Link></li>
              <li><Link to="/register"><ArrowRight size={12} /> Create Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Equipment Categories</h4>
            <ul>
              {['Diagnostic Equipment','Laboratory Equipment','Surgical Instruments','Patient Monitoring','Imaging Equipment','Consumables & Supplies','Rehabilitation Equipment','Dental Equipment'].map(cat => (
                <li key={cat}><Link to={`/products?category=${encodeURIComponent(cat)}`}><ArrowRight size={12} /> {cat}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <div className="footer-contacts">
              <div className="footer-contact-item">
                <Phone size={16} />
                <div>
                  <span>Call / WhatsApp</span>
                  <a href="tel:0790080903">0790 080 903</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} />
                <div>
                  <span>Email Us</span>
                  <a href="mailto:info@medithrex.co.ke">info@medithrex.co.ke</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <MapPin size={16} />
                <div>
                  <span>Location</span>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            <Link to="/quote" className="btn btn-primary btn-sm" style={{ marginTop: '20px' }}>
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Medithrex Medical Solutions. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Returns Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
