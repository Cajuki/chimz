import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import './ProductsPage.css';

const CATEGORIES = [
  'Diagnostic Equipment','Laboratory Equipment','Surgical Instruments',
  'Patient Monitoring','Imaging Equipment','Consumables & Supplies',
  'Rehabilitation Equipment','Dental Equipment'
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const inStock = searchParams.get('inStock') || '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (inStock) params.set('inStock', inStock);
    params.set('page', page);
    params.set('limit', 12);

    axios.get(`/api/products?${params}`)
      .then(r => { setProducts(r.data.products || []); setTotal(r.data.total || 0); setPages(r.data.pages || 1); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search, page, inStock]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam('search', searchInput);
  };

  const clearAll = () => { setSearchInput(''); setSearchParams({}); };

  return (
    <div className="products-page">
      {/* Page hero */}
      <div className="page-hero">
        <div className="container page-hero-content">
          <p className="section-label">Medithrex Product Catalogue</p>
          <h1>Medical & Laboratory Equipment</h1>
          <p>Browse our extensive range of quality-certified medical and laboratory equipment for healthcare institutions across Kenya.</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar */}
        <aside className={`products-sidebar${filterOpen ? ' open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filter Products</h3>
            <button className="sidebar-close" onClick={() => setFilterOpen(false)}><X size={20} /></button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <button
              className={`filter-cat-btn${!category ? ' active' : ''}`}
              onClick={() => setParam('category', '')}
            >All Categories <span>{total}</span></button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-cat-btn${category === cat ? ' active' : ''}`}
                onClick={() => setParam('category', cat)}
              >{cat}</button>
            ))}
          </div>

          <div className="filter-group">
            <label className="filter-label">Availability</label>
            <label className="filter-check">
              <input type="checkbox" checked={inStock === 'true'} onChange={e => setParam('inStock', e.target.checked ? 'true' : '')} />
              In Stock Only
            </label>
          </div>

          {(category || search || inStock) && (
            <button className="btn btn-outline btn-sm" onClick={clearAll} style={{ width: '100%', marginTop: '8px' }}>
              <X size={14} /> Clear Filters
            </button>
          )}
        </aside>

        {/* Main */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <form onSubmit={handleSearch} className="search-form">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
            <div className="toolbar-right">
              <span className="result-count">{total} product{total !== 1 ? 's' : ''}</span>
              <button className="filter-toggle-btn" onClick={() => setFilterOpen(true)}>
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(category || search) && (
            <div className="active-filters">
              {category && <span className="filter-tag">{category} <button onClick={() => setParam('category', '')}><X size={12} /></button></span>}
              {search && <span className="filter-tag">"{search}" <button onClick={() => { setSearchInput(''); setParam('search', ''); }}><X size={12} /></button></span>}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="loading-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner" />
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your search or filters.</p>
              <button className="btn btn-dark" onClick={clearAll}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn${page === i + 1 ? ' active' : ''}`}
                  onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', i + 1); setSearchParams(p); }}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
