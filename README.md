# Medithrex — Medical & Laboratory Equipment Platform

Kenya's premier e-commerce platform for medical and laboratory equipment. Built with React + Vite (frontend) and Node.js + Express (backend).

---

## Features

- **Product Catalogue** — 12 demo products across 8 categories with search, filter, and pagination
- **Product Detail** — Full specs, add to cart, request quote per product
- **Quote Requests** — Submit multi-item quote requests (no account needed)
- **Shopping Cart** — Persistent cart with M-Pesa / Invoice / Bank payment options
- **Order Checkout** — Full order placement with address and payment selection
- **User Accounts** — Register, login, dashboard with orders & quotes history
- **Admin-ready** — Role-based auth (user / admin) wired in
- **Contact Form** — Direct contact with the sales team
- **About Page** — Company story, values, team, and stats
- **Kenyan Theme** — Black, yellow & white palette; Nairobi-centric copy; all 47 counties
- **Responsive** — Mobile-first, works on all screen sizes

---

## Tech Stack

| Layer     | Tech                                    |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite 5, React Router v6       |
| Styling   | Pure CSS (custom design system)         |
| UI Fonts  | Bebas Neue, Barlow Condensed, Barlow    |
| Backend   | Node.js, Express 4                      |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| Database  | MongoDB (Mongoose) — optional, in-memory demo mode available |
| HTTP      | Axios                                   |
| Toasts    | react-hot-toast                         |

---

## Project Structure

```
medithrex/
├── backend/
│   ├── server.js           # Express entry point
│   ├── routes/
│   │   ├── auth.js         # Register, login, profile
│   │   ├── products.js     # Product catalogue (with 12 demo products)
│   │   ├── orders.js       # Order management
│   │   ├── quotes.js       # Quote requests
│   │   └── contact.js      # Contact form
│   ├── models/             # Mongoose models (User, Product, Order, Quote)
│   ├── middleware/
│   │   └── auth.js         # JWT protect & admin middleware
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── QuotePage.jsx
    │   │   ├── ContactPage.jsx
    │   │   ├── AboutPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── AccountPage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   └── App.jsx
    └── vite.config.js
```

---

## Setup & Running

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment (Optional — MongoDB)

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI if using a real database
# Without it, the app runs in in-memory demo mode (data resets on restart)
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# API running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### 4. Open in Browser

Visit: **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | /api/auth/register        | —        | Create account           |
| POST   | /api/auth/login           | —        | Sign in                  |
| GET    | /api/auth/profile         | Required | Get own profile          |
| PUT    | /api/auth/profile         | Required | Update profile           |
| GET    | /api/products             | —        | List products (filters)  |
| GET    | /api/products/categories  | —        | List categories          |
| GET    | /api/products/:id         | —        | Single product           |
| POST   | /api/orders               | Required | Place order              |
| GET    | /api/orders/my            | Required | My orders                |
| POST   | /api/quotes               | —        | Submit quote request     |
| GET    | /api/quotes/my            | Required | My quotes                |
| POST   | /api/contact              | —        | Send contact message     |

---

## Contact

**Medithrex Medical Solutions**  
📞 0790 080 903  
📧 info@medithrex.co.ke  
📍 Nairobi, Kenya
