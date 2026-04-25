import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './Navbar.css';

const categories = [
  'Diagnostic Equipment', 'Laboratory Equipment', 'Surgical Instruments',
  'Patient Monitoring', 'Imaging Equipment', 'Consumables & Supplies',
  'Rehabilitation Equipment', 'Dental Equipment'
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Top bar */}
      <div className="navbar-topbar">
        <div className="container">
          <span><Phone size={12} /> 0790 080 903</span>
          <span>Mon – Fri: 8:00 AM – 6:00 PM EAT</span>
          <span>Serving Kenya & East Africa</span>
        </div>
      </div>

      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">MEDITHREX</span>
            <span className="logo-sub">MEDICAL SOLUTIONS</span>
          </Link>

          {/* Desktop nav */}
          <ul className="navbar-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li
              className="has-dropdown"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link to="/products" className={location.pathname.startsWith('/products') ? 'active' : ''}>
                Products <ChevronDown size={14} />
              </Link>
              {productsOpen && (
                <div className="dropdown">
                  <div className="dropdown-inner">
                    <Link to="/products" className="dropdown-all">View All Products →</Link>
                    {categories.map(cat => (
                      <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
            <li><Link to="/quote" className={location.pathname === '/quote' ? 'active' : ''}>Request Quote</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <Link to="/cart" className="cart-btn">
              <ShoppingCart size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>

            {user ? (
              <div className="user-menu">
                <button className="user-btn">
                  <User size={18} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={13} />
                </button>
                <div className="user-dropdown">
                  <Link to="/account">My Account</Link>
                  <Link to="/account/orders">My Orders</Link>
                  <Link to="/account/quotes">My Quotes</Link>
                  <hr />
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}

            <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/">Home</Link>
            <Link to="/products">All Products</Link>
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="mobile-sub">
                — {cat}
              </Link>
            ))}
            <Link to="/quote">Request Quote</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <div className="mobile-divider" />
            {user ? (
              <>
                <Link to="/account">My Account</Link>
                <button onClick={handleLogout} className="mobile-logout">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login">Sign In</Link>
                <Link to="/register">Create Account</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
