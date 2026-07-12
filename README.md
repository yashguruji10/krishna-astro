# Jay Durga Jyotish - Website

A modern, multilingual (English / Hindi / Gujarati) website for an Indian Jyotish (astrologer) to showcase services & products, receive enquiries via Email + WhatsApp, and manage everything through an admin panel — built entirely with **free, open-source tools** (Next.js, MongoDB, Nodemailer over free SMTP, wa.me WhatsApp links).

## Features

- 3 languages: English (default), Hindi, Gujarati — switch via dropdown, URL prefix `/hi` or `/gu`
- Public pages: Home, About Us, Services & Products list + detail, Contact, Terms & Conditions, Privacy Policy
- Each service/product has its own enquiry form → sends an email (to you + the customer) and gives the customer a "Send via WhatsApp" button (free `wa.me` link, no paid API)
- Admin panel (`/admin`):
  - Login (JWT + bcrypt, no third-party auth service)
  - Dashboard with stats
  - Add/Edit/Delete services & products (multilingual title/description, image upload, price, active toggle, order)
  - View/manage enquiries (status, WhatsApp/email shortcuts)
  - Site Settings — edit ALL site-wide content & links from one place: logo, contact phone/email/WhatsApp number, social links, homepage hero text & image, About Us page, Terms & Conditions, Privacy Policy, footer text — each translatable into all 3 languages
- Mobile-friendly responsive design (Tailwind CSS)
- Images uploaded and stored locally on your server (`public/uploads`) — no paid storage

## Tech Stack (all free / open source)

- Next.js 14 (App Router)
- MongoDB + Mongoose (use free MongoDB Atlas tier or self-hosted MongoDB)
- next-intl for translations
- Tailwind CSS
- Nodemailer (use any free SMTP: Gmail App Password, Zoho Mail free, Brevo free tier)
- bcryptjs + jsonwebtoken for admin auth
- wa.me links for WhatsApp (free, official WhatsApp click-to-chat)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.example .env.local
   ```

   - `MONGODB_URI` — your MongoDB connection string (e.g. from MongoDB Atlas free tier, or `mongodb://localhost:27017/jay_durga_jyotish` for local MongoDB)
   - `JWT_SECRET` — any long random string (used to sign admin login tokens)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the first admin account (created by the seed script)
   - `SMTP_*` — your free SMTP provider details (see below)
   - `NOTIFY_EMAIL` — where new enquiry notifications are sent (your business email)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — default WhatsApp number (can also be changed from Admin → Settings)

3. **Seed the database** (creates the admin account + all 16 real services/products imported from your old site)
   ```bash
   npm run seed
   ```

   This seed now includes your actual content from `jaydurgajyotish.vercel.app`:
   - All 16 services/products (Love Marriage Specialist, Love Problem Solutions, Marriage Problem Solutions, Husband & Wife Problem, Black Magic Removal, Vashikaran Expert, Spiritual Healing, Enemy Problem, Horoscope Reading, Santan Prapti, Business Problem, Jobs & Career Expert, Hast Rekha Reading, Gem Stone Services, Health Issues, All Goddess Puja) with descriptions in English, Hindi and Gujarati
   - Site settings pre-filled with your real logo, hero image, About Us content, contact email/phone/Facebook, and address (Gita Nagar Society, Gas Circle, Adajan Road, Surat - 395009)

   Images are initially linked from your old site (`jaydurgajyotish.vercel.app/images/...`) so everything displays correctly immediately. To host images yourself, go to Admin → Services/Settings, use "Upload Image" to replace each image with a copy stored on your own server (`public/uploads`).

4. **Run in development**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login` for the admin panel.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Free SMTP Options (for sending emails)

Pick any one:

- **Gmail**: Enable 2FA on your Google account, then create an "App Password" (Google Account → Security → App Passwords). Use:
  - `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`
  - `SMTP_USER` = your Gmail address, `SMTP_PASS` = the App Password
- **Zoho Mail (free)**: `smtp.zoho.com`, port `587`
- **Brevo (formerly Sendinblue, free tier 300 emails/day)**: provides free SMTP credentials

If SMTP is not configured, the site still works — enquiries are saved to the database and the customer is given a WhatsApp link, but email notifications are skipped.

## Editing Content via Admin

Log in at `/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env.local`.

- **Services**: Admin → Services & Products → Add New / Edit. Fill the title/description in all 3 languages using the language tabs, upload an image, set price (0 = "Price on Request"), and toggle Active.
- **Site Settings**: Admin → Site Settings. This single page controls:
  - Branding (site name, logo, favicon)
  - Contact info & all links (phone, email, WhatsApp number, social media links, Google Maps embed)
  - Home page hero text/image and short About section
  - Full About Us page
  - Terms & Conditions page
  - Privacy Policy page
  - Footer text

  Every text field has English / Hindi / Gujarati tabs — fill at least English; if a translation is missing the site falls back to English.
- **Orders/Enquiries**: Admin → Orders. View customer details, update status (New → Contacted → In Progress → Completed/Cancelled), and one-click open WhatsApp or Email to reply.

## Notes on "Free / No Paid APIs"

- WhatsApp messaging uses `https://wa.me/<number>?text=...` links (official, free, opens WhatsApp app/web with a pre-filled message) — **not** the paid WhatsApp Business API.
- Images are stored on your own server's filesystem (`public/uploads`), not a paid cloud storage service.
- Email uses Nodemailer with your own SMTP credentials (free tiers available from Gmail, Zoho, Brevo, etc.) — no paid transactional email service required.
- Authentication is self-contained (bcrypt + JWT cookies) — no third-party auth provider.

## Project Structure

```
src/
  app/
    [locale]/          → public site pages (home, about, services, contact, terms, privacy)
    admin/             → admin panel (login + protected dashboard/services/orders/settings)
    api/               → API routes (orders, contact, services, settings, upload, admin auth)
  components/          → shared UI components
  components/admin/    → admin-only UI components
  lib/                  → db connection, auth, mail, whatsapp helpers, site settings
  models/              → Mongoose schemas (Service, Order, Admin, SiteSettings)
  messages/            → en.json / hi.json / gu.json translation files
scripts/seed.mjs       → creates admin account + sample services
```
