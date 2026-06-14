# AERONEXUS — Node.js Backend

> Aerospace Intelligence Store — Full-stack backend powering the AERONEXUS storefront.

---

## 📁 Project Structure

```
aeronexus/
├── server.js              ← Express entry point
├── db.js                  ← In-memory data store (swap for real DB)
├── .env                   ← Environment variables (never commit this!)
├── package.json
├── middleware/
│   └── auth.js            ← JWT middleware (requireAuth, requireAdmin)
├── routes/
│   ├── auth.js            ← POST /api/auth/admin-login, /register, /login, /me
│   ├── products.js        ← GET/POST/PUT/DELETE /api/products
│   ├── reviews.js         ← GET/POST /api/reviews/:productId
│   ├── orders.js          ← POST /api/orders, GET/PATCH (admin)
│   └── upload.js          ← POST /api/upload/file, /api/upload/thumb/:id
├── uploads/               ← Uploaded files land here (gitignored)
└── public/
    ├── index.html         ← The AERONEXUS frontend (original HTML, patched)
    └── js/
        └── api.js         ← Frontend API client (replaces localStorage calls)
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` with your settings:
```env
PORT=3000
JWT_SECRET=your_random_secret_here
ADMIN_EMAIL=admin@aeronexus.com
ADMIN_PASSWORD=your_secure_password
MAX_FILE_SIZE_MB=100
```

### 3. Run the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Open **http://localhost:3000** — the store is live.

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/admin-login` | `{ email, password }` | — |
| POST | `/api/auth/register`    | `{ name, email, password }` | — |
| POST | `/api/auth/login`       | `{ email, password }` | — |
| GET  | `/api/auth/me`          | — | Bearer token |

### Products
| Method | Endpoint | Query/Body | Auth |
|--------|----------|------------|------|
| GET    | `/api/products` | `?type=ebook&search=orbital` | — |
| GET    | `/api/products/:id` | — | — |
| POST   | `/api/products` | `{ title, description, type, price, ... }` | Admin |
| PUT    | `/api/products/:id` | same fields | Admin |
| DELETE | `/api/products/:id` | — | Admin |

### File Upload
| Method | Endpoint | Form fields | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload/file` | `file` (binary), `title`, `description`, `type`, `price` | Admin |
| POST | `/api/upload/thumb/:productId` | `thumb` (image) | Admin |

### Reviews
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| GET  | `/api/reviews/:productId` | — | — |
| POST | `/api/reviews/:productId` | `{ userName, rating, text }` | — |

### Orders
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST  | `/api/orders` | `{ productId, userName, userEmail, method }` | — |
| GET   | `/api/orders` | — | Admin |
| PATCH | `/api/orders/:id/status` | `{ status: "confirmed" }` | Admin |

---

## 🗄️ Upgrading to a Real Database

The `db.js` file is the only file that needs changing. It exports a simple object with methods like `getProducts()`, `createProduct()`, etc. Replace the in-memory arrays with your ORM calls (e.g. Prisma + PostgreSQL, Sequelize + MySQL, or Mongoose + MongoDB) and the rest of the server stays identical.

**Recommended for production:**
- **SQLite** via `better-sqlite3` — zero infrastructure, great for small stores
- **PostgreSQL** via `prisma` — scales well, hosted free on Railway/Neon
- **MongoDB** via `mongoose` — good for flexible product schemas

---

## 🔒 Security Notes

- Change `JWT_SECRET` and `ADMIN_PASSWORD` in `.env` before deploying
- `uploads/` is served publicly — never let users upload HTML/JS files (the `fileFilter` in `upload.js` blocks this)
- Add HTTPS (via Nginx reverse proxy or a host like Railway/Render) in production
- The `express-rate-limit` middleware is already configured on all API routes

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server & routing |
| `cors` | Cross-origin request headers |
| `dotenv` | `.env` file loading |
| `jsonwebtoken` | JWT signing & verification |
| `bcryptjs` | Password hashing |
| `multer` | Multipart file uploads |
| `express-rate-limit` | Brute-force protection |
| `uuid` | Unique ID generation |
| `nodemon` (dev) | Auto-restart on file changes |
