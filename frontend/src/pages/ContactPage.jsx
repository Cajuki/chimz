import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', form);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container page-hero-content">
          <p className="section-label">Get In Touch</p>
          <h1>Contact Us</h1>
          <p>Our team is ready to assist with product enquiries, quotes, and technical support.</p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* Info */}
        <div className="contact-info">
          <div className="contact-info-card">
            <div className="ci-icon"><Phone size={22} /></div>
            <div>
              <h4>Phone & WhatsApp</h4>
              <a href="tel:0790080903">0790 080 903</a>
              <p>Call or WhatsApp anytime</p>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="ci-icon"><Mail size={22} /></div>
            <div>
              <h4>Email</h4>
              <a href="mailto:info@medithrex.co.ke">info@medithrex.co.ke</a>
              <p>We reply within 24 hours</p>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="ci-icon"><MapPin size={22} /></div>
            <div>
              <h4>Location</h4>
              <p>Nairobi, Kenya</p>
              <p>Nationwide delivery available</p>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="ci-icon"><Clock size={22} /></div>
            <div>
              <h4>Working Hours</h4>
              <p>Monday – Friday: 8AM – 6PM</p>
              <p>Saturday: 9AM – 2PM EAT</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="contact-success">
            <CheckCircle size={48} />
            <h3>Message Received!</h3>
            <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
            <a href="tel:0790080903" className="btn btn-primary"><Phone size={16} /> 0790 080 903</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <h3>Send Us a Message</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0700 000 000" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  <option value="">Select Subject</option>
                  <option>Product Enquiry</option>
                  <option>Quote Request</option>
                  <option>Order Support</option>
                  <option>Technical Support</option>
                  <option>General Enquiry</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" value={form.message} onChange={e => set('message', e.target.value)} required placeholder="How can we help you?" style={{ minHeight: '140px' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
