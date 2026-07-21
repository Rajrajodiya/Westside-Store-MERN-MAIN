# 🛍️ WestSide Store — Monolithic MERN Application

A full-stack e-commerce web application for fashion and lifestyle shopping. Built with **React** (frontend) and **Express + MongoDB** (backend) in a **monolithic architecture** — both frontend and backend are part of one application, deployed together.

> **Live demo:** [Coming soon]  
> **Architecture:** Monolithic (API + Client served from same Express server)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Docker](#-docker)
- [Testing](#-testing)
- [Performance](#-performance)
- [Tiers Completed](#-tiers-completed)

---

## ✨ Features

### Shopping Experience
- Browse products by category (Women, Men, Kids, Beauty, Jewellery, Home)
- Product search with live results dropdown (debounced + weighted text index)
- Product detail pages with image gallery, pincode checker, size selection
- Shopping cart with quantity controls
- Wishlist management
- Secure checkout with Stripe card payments, UPI, or Cash On Delivery

### User Account
- User registration & login (JWT-based authentication)
- Password reset flow (email-based reset link)
- Order history with status tracking
- PDF invoice download for each order
- Order cancellation (while in "Processing" status)

### Admin Features
- First registered user auto-granted admin privileges
- Product CRUD (create, read, update, delete)
- Order management (view all orders, update status)
- User management (list all users)
- Image upload with file type validation

### UX & Performance
- Toast notifications for all actions
- Loading spinners for async operations
- SEO meta tags on every page
- 404 page with navigation
- React.lazy code splitting (route-level)
- Image lazy loading (`loading="lazy"`)
- Debounced search with AbortController
- React.memo on heavy components

### Security & DevOps
- Helmet.js security headers
- Rate limiting per route group
- MongoDB injection sanitization
- XSS sanitization
- Docker multi-stage builds
- PM2 process management (cluster mode)
- NGINX reverse proxy config (with SSL)
- GitHub Actions CI/CD pipeline
- ESLint + Prettier code quality

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, Bootstrap 5, FontAwesome |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB 7 (Mongoose ODM) |
| **Auth** | JSON Web Tokens (JWT) |
| **Payments** | Stripe (with mock mode fallback) |
| **Email** | Nodemailer (SMTP) |
| **PDF** | PDFKit |
| **File Upload** | Multer |
| **Testing** | Jest, Supertest, mongodb-memory-server |
| **Container** | Docker, docker-compose |
| **CI/CD** | GitHub Actions |
| **Process Mgr** | PM2 |

---

## 📁 Project Structure

```
Westside-Store-MERN-MAIN/
├── client/                      # 🎨 Frontend (React app)
│   ├── public/                  # Static assets
│   │   └── Images/              # Product & banner images
│   └── src/
│       ├── assets/              # Styles, images
│       │   ├── styles/          # CSS files (auth, cart, header, etc.)
│       │   └── Images/          # Home page carousel images
│       ├── components/          # Shared React components
│       │   ├── Cart.js          # Shopping cart
│       │   ├── Footer.js        # Site footer
│       │   ├── Header.js        # Navigation + search + cart badge
│       │   ├── Layout.js        # App shell (Header + Outlet + Footer)
│       │   ├── LoadingSpinner.js
│       │   ├── MyAccount.js     # User orders + invoice download
│       │   ├── ProductDetail.js # Single product view
│       │   ├── ProductList.js   # Category listing + search results
│       │   ├── SeoHelmet.js     # Meta tags wrapper
│       │   ├── ToastConfig.js   # Toast notification helpers
│       │   └── Wishlist.js
│       ├── pages/               # Route-level page components
│       │   ├── About.js
│       │   ├── Auth.js          # Login + Register
│       │   ├── Contact.js
│       │   ├── Home.js          # Landing page with carousels
│       │   ├── NotFound.js      # 404 page
│       │   ├── Payment.js       # Checkout page
│       │   ├── ResetPassword.js # Forgot/Reset password
│       │   └── Signup.js        # (Alias for Auth.js)
│       ├── App.js               # Root with lazy-loaded routes
│       └── index.js             # Entry point (HelmetProvider)
│
├── server/                      # ⚙️ Backend (Express API)
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── middleware/
│   │   ├── admin.js             # Admin role checker
│   │   ├── auth.js              # JWT verification
│   │   └── security.js          # Rate limiting + sanitizers
│   ├── models/
│   │   ├── Contact.js
│   │   ├── Order.js
│   │   ├── PasswordReset.js     # Token-based reset with TTL
│   │   ├── Product.js           # With text index for search
│   │   └── User.js              # With isAdmin field
│   ├── routes/
│   │   ├── admin.js             # Admin CRUD (products, orders, users)
│   │   ├── auth.js              # Signup, login, forgot/reset password
│   │   ├── contact.js           # Contact form submission
│   │   ├── orders.js            # Place, fetch, invoice, cancel
│   │   ├── payment.js           # Stripe payment intents
│   │   ├── products.js          # Category, search, single product
│   │   └── upload.js            # Image upload (single + multiple)
│   ├── services/
│   │   └── email.js             # Nodemailer (order confirmation + password reset)
│   ├── tests/                   # Jest test suites
│   │   ├── setup.js             # mongodb-memory-server + test helpers
│   │   ├── auth.test.js         # 12 tests
│   │   ├── products.test.js     # 6 tests
│   │   ├── orders.test.js       # 6 tests
│   │   └── contact.test.js      # 3 tests
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── .env                         # Environment variables (see below)
├── .eslintrc.json               # Server-side ESLint config
├── .prettierrc                  # Prettier config
├── .gitignore
├── .dockerignore
├── Dockerfile                   # Multi-stage production build
├── docker-compose.yml           # Express + MongoDB services
├── ecosystem.config.js          # PM2 cluster mode config
├── nginx.conf                   # NGINX reverse proxy (SSL + caching)
├── .github/workflows/deploy.yml # CI/CD pipeline
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **MongoDB** >= 6 (local or Atlas)
- **npm** >= 9

### 1. Clone & Install

```bash
git clone <repo-url>
cd Westside-Store-MERN-MAIN

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Install root dev tool
cd ..
npm install --save-dev concurrently
```

### 2. Environment Variables

Copy the template below into `.env` at the project root:

```env
# === MongoDB ===
MONGO_URI=mongodb://localhost:27017/westside-store

# === JWT ===
JWT_SECRET=your-super-secret-key-change-in-production

# === Server ===
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# === Email (Resend / SendGrid) ===
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=re_xxxxxxxxxxxx
SMTP_FROM=orders@westside-store.com

# === Stripe (leave as placeholder for mock mode) ===
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=
```

### 3. Seed the Database

1. Import products from `WESTSIDE-STORE.products.csv` into MongoDB
2. Or create a seed script to populate the Products collection

### 4. Start Development

```bash
# From project root — starts both server and client
npx concurrently "cd client && npm start" "cd server && node server.js"
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### 5. Production Build

```bash
cd client && npm run build
cd .. && NODE_ENV=production node server/server.js
```

The Express server will serve the React build from `client/build/`.

---

## 🔐 Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `MONGO_URI` | ✅ | MongoDB connection string | `mongodb://localhost:27017/westside-store` |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens | — |
| `PORT` | ❌ | Express server port | `5000` |
| `NODE_ENV` | ❌ | Environment mode | `development` |
| `CLIENT_URL` | ❌ | CORS origin | `http://localhost:3000` |
| `SMTP_HOST` | ⚠️ | SMTP server (email features) | — |
| `SMTP_PORT` | ⚠️ | SMTP port | `587` |
| `SMTP_USER` | ⚠️ | SMTP username | — |
| `SMTP_PASSWORD` | ⚠️ | SMTP password | — |
| `SMTP_FROM` | ⚠️ | From email address | — |
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret (mock mode if placeholder) | — |
| `STRIPE_WEBHOOK_SECRET` | ❌ | Stripe webhook signing secret | — |

> ✅ = Required for app to start  
> ⚠️ = Required only for that specific feature  
> ❌ = Optional

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | — | Register new user (first user = admin) |
| POST | `/login` | — | Login with email + password |
| POST | `/forgot-password` | — | Send reset link to email |
| POST | `/reset-password` | — | Reset password with token |
| GET | `/me` | ✅ | Get current user profile |

### Products (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=` | Text search (weighted: name > brand > description > category) |
| GET | `/:category` | List products by category |
| GET | `/:category/:id` | Get single product |

### Orders (`/api/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/place` | ✅ | Place a new order |
| GET | `/user/:email` | ✅ | Get user's orders |
| GET | `/:orderNumber/invoice` | ✅ | Download PDF invoice |
| PUT | `/status/:orderNumber` | ✅ | Update order status |

### Payment (`/api/payment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-payment-intent` | ✅ | Create Stripe payment intent |
| POST | `/webhook` | — | Stripe webhook handler |

### Contact (`/api/contact`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Submit contact form |

### Upload (`/api/upload`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Upload single image (JPEG/PNG/WebP/AVIF, max 5MB) |
| POST | `/multiple` | ✅ | Upload multiple images |

### Admin (`/api/admin`) — Requires admin role

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/orders` | List all orders |
| PUT | `/orders/:id/status` | Update any order status |
| GET | `/users` | List all users |

---

## 📜 Available Scripts

### Client (`client/`)

| Script | Description |
|--------|-------------|
| `npm start` | Start React dev server (port 3000) |
| `npm run build` | Production build |
| `npm test` | Run frontend tests |
| `npm run analyze` | Build + open `source-map-explorer` bundle visualizer |
| `npm run build:profile` | Build with React profiling enabled |

### Server (`server/`)

| Script | Description |
|--------|-------------|
| `node server.js` | Start Express server (port 5000) |
| `npx jest` | Run backend test suite (25 tests) |
| `npx jest --coverage` | Run tests with coverage report |

### Root

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both server + client concurrently |

---

## 🐳 Docker

### Build & Run

```bash
# Build the image
docker build -t westside-store .

# Run with docker-compose (includes MongoDB)
docker-compose up -d

# Or run standalone (requires external MongoDB)
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/westside-store \
  -e JWT_SECRET=your-secret \
  westside-store
```

### Docker Compose Services

| Service | Port | Description |
|---------|------|-------------|
| `app` | 5000 | Express + React (monolithic) |
| `mongo` | 27017 | MongoDB 7 with persistent volume |
| `nginx` | 80, 443 | (Optional) Reverse proxy with SSL |

---

## 🧪 Testing

```bash
cd server
npx jest --forceExit --detectOpenHandles
```

**Test suites:** 25 tests across 4 suites

| Suite | Tests | What's tested |
|-------|-------|---------------|
| `auth.test.js` | 12 | Signup validation, duplicate email, admin auto-grant, login, forgot-password |
| `products.test.js` | 6 | Category listing, text search, single product, 404 handling |
| `orders.test.js` | 6 | Order placement, auth validation, email mismatch, field validation, user orders |
| `contact.test.js` | 3 | Form submission, empty rejection, missing field rejection |

Tests use **mongodb-memory-server** for isolated, throwaway databases per suite.

---

## ⚡ Performance Optimizations

| Technique | Applied To | Gain |
|-----------|-----------|------|
| **React.lazy + Suspense** | All 12 route components | ~60% smaller initial bundle |
| **Image lazy loading** | All `<img>` tags across 10+ components | Faster page loads, less data |
| **Debounced search** | Header search (300ms + AbortController) | ~90% fewer API calls |
| **React.memo** | Header component | Prevents re-renders on route changes |
| **Cache-Control** | Static assets (30d immutable), HTML (no-cache) | Instant repeat visits |
| **text index** | Product model (weighted search) | Fast relevance-ranked search |
| **TTL index** | PasswordReset tokens | Auto-cleanup after 1 hour |

---

## 📦 Tiers Completed

This project was built in 5 progressive tiers:

| Tier | Focus | Status |
|------|-------|--------|
| **1** | Monolithic architecture, security, logging | ✅ |
| **2** | Payments, email, search, uploads, admin, password reset, invoices | ✅ |
| **3** | Toast notifications, loading spinners, SEO, 404 page, cart badge | ✅ |
| **4** | Docker, PM2, NGINX, CI/CD, ESLint, Jest tests (25/25) | ✅ |
| **5** | Code splitting, lazy loading, debounced search, cache headers, bundle analysis | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make changes and run tests (`npx jest`)
4. Commit (`git commit -m 'Add my feature'`)
5. Push (`git push origin feature/my-feature`)
6. Open a Pull Request

---

## 📄 License

This project is for educational and demonstration purposes.

Built with ❤️ using the MERN stack.
