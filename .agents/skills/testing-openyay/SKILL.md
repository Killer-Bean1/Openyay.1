---
name: testing-openyay
description: Test the OpenYay e-commerce app end-to-end. Use when verifying registration, product creation, favorites, messaging, or search UI.
---

# Testing OpenYay E-Commerce App

## Local Setup

### Backend (FastAPI)
```bash
cd backend
# Set DATABASE_URL to SQLite for local testing (no PostgreSQL needed)
echo 'DATABASE_URL=sqlite:///./openyay.db' > .env
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Verify: `curl http://localhost:8000/` should return `{"message":"OpenYay is live"}`

### Frontend (React + Vite)
```bash
cd frontend
npm install
# Fix permissions if needed:
chmod +x node_modules/.bin/vite
./node_modules/.bin/vite --host 0.0.0.0
```
Frontend runs on http://localhost:5173

## Known Issues

- **TailwindCSS v4**: The project uses `@tailwindcss/vite` plugin. If `postcss.config.js` exists with `tailwindcss` as a PostCSS plugin, it will conflict. Remove `postcss.config.js` — the Vite plugin handles CSS.
- **Navbar state**: After login, the navbar doesn't update until page refresh. This is because `Navbar.jsx` reads `localStorage` once on mount with no auth context subscription. Refresh the page after login to see updated nav links.
- **Corrupted files**: The original source zip had trailing garbage in some JSX files (App.jsx, Register.jsx). If you see parse errors mentioning unexpected tokens after `export default`, check for and remove duplicated trailing content.

## Test Accounts

Register test accounts via the UI at /register:
- **Business user**: Any email with role="business" — can access /business-dashboard and create products
- **Customer user**: Any email with role="customer" — can browse products, favorite them, send messages

Passwords must be 6+ characters.

## Key Test Flows

### Registration + Login
1. Navigate to /register
2. Fill: full_name, email, password, password_confirm, select Account Type dropdown
3. Click Register → alert "Account created successfully! Please log in." → redirects to /login
4. Login with email/password → redirects to /products
5. Refresh page to see updated navbar (Favorites, Messages, Profile, Logout)

### Product Creation (Business User)
1. Login as business user
2. Navigate to /business-dashboard
3. Click "+ Add Product" button
4. Fill: title, price, category, inventory, description (image_url optional)
5. Click "Add Product" → alert "Product added successfully!"
6. Verify product appears on /products page

### Favorites (Customer)
1. Login as customer
2. Navigate to /products, click a product card
3. On product detail page, click "Add to Favorites" button
4. Button changes to red "Remove from Favorites"
5. Navigate to /favorites to see the favorited item

### Search/Filter
1. On /products page, type in the Search box
2. Results filter in real-time (debounced via useEffect)
3. Non-matching search shows "No products found"

## API Endpoints (for reference)
- POST /api/auth/register — {full_name, email, password, role}
- POST /api/auth/login — form-data: username (email), password
- GET /api/products — ?search=&category=&sort=price
- POST /api/products — {title, description, price, category, inventory, image_url} (business only)
- POST /api/favorites/{product_id} — add favorite
- GET /api/favorites — list user's favorites
- POST /api/messages — {receiver_id, content}
- GET /api/messages/inbox — list messages

## Devin Secrets Needed
None — the app runs fully locally with SQLite.
