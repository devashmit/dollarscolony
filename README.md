# ⚜️ Dollars Colony, Kundapura

> **Premium Coastal Villa Plots** — A premium coastal villa plot community developed by **Sri Brahmari** in Kundapura. Designed with luxury amenities, deep cultural motifs, and a fully featured admin dashboard for inventory, gallery, updates, and lead management.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🎨 Design Aesthetics & Golden Embroidery](#-design-aesthetics--golden-embroidery)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🚀 Getting Started](#-getting-started)
- [🛡️ Authentication & Administration](#️-authentication--administration)
- [📈 Deployment](#-deployment)

---

## ✨ Key Features

### 🏡 Interactive Plot Explorer
* **Real-time Map Visualizer:** An interactive SVG-based layout explorer where prospective buyers can inspect available, booked, and blocked plots.
* **Instant Details:** Displays size, dimensions, and availability status upon hover or tap.
* **Lead Capturing:** Direct lead forms tailored to specific plot inquiries.

### 💼 Powerful Admin Dashboard
* **Leads & Inquiries Manager:** View, filter, and track incoming buyer leads in real time.
* **Plot Inventory Management:** Easily update plot availability, dimensions, and status (Available, Booked, Blocked).
* **Vercel Blob Integration:** Seamless drag-and-drop media uploads to Vercel Blob storage for project gallery and updates.
* **Excel Data Export:** Export the entire lead database directly to Excel (`.xlsx`) format.
* **Content Customizer:** Dynamic management of testimonials, news/updates, and global site settings.

### 📍 Rich Informational Landing Sections
* **Hero Banner:** Premium, conversion-focused design with Outfit and Cinzel typography.
* **Amenities:** Showcases the clubhouse, lifestyle perks, and premium infrastructure.
* **Location Highlights:** Highlighting close proximity to beaches, backwaters, and National Highway 66 (NH66).
* **Booking Process:** A step-by-step walkthrough of the buying journey.
* **FAQs & Trust Modules:** Addressing consumer inquiries and highlighting developer credibility.

---

## 🎨 Design Aesthetics & Golden Embroidery

Dollars Colony features custom golden SVGs and visual dividers that integrate local geography and developer heritage:
* **Lotus Divider (Sri Brahmari):** Symmetrical lotus flower motif representing purity, creation, and trust in the Sri Brahmari brand.
* **Coastal Backwater Wave:** Interlocking wave design honoring Kundapura's beautiful coastal geography.
* **Banyan Roots (Tree of Life):** Elegant root/tree lines symbolizing long-term real estate investment and generational wealth.
* **Themes Supported:** Custom themes tailored for dark royal navy, ancient forest green, and classic sand & ivory backgrounds.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) & [Base UI](https://base-ui.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Authentication** | [NextAuth.js v5 (Beta)](https://next-auth.js.org/) |
| **Database/Storage**| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Data Parsing** | [SheetJS (xlsx)](https://sheetjs.com/) |
| **Validation** | [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/) |

---

## 📁 Project Structure

```bash
dollarscolony/
├── app/                      # Next.js App Router routes
│   ├── admin/                # Admin Panel pages (leads, plots, gallery, settings)
│   ├── api/                  # API endpoints (leads, content uploads, settings)
│   ├── embroidery-showcase/  # Live preview area for theme dividers
│   ├── login/                # Admin authentication login page
│   ├── layout.tsx            # Global application layout
│   └── page.tsx              # Landing page entrance (delegates to home.tsx)
├── components/               # Reusable UI & Layout components
│   ├── admin/                # Admin-specific panels & UI controls
│   ├── layout/               # Header, Footer, and Navigation
│   ├── sections/             # Modular landing page sections (Hero, Amenities, Plots)
│   └── ui/                   # Global UI primitives (buttons, modals, dividers)
├── hooks/                    # Custom React Hooks
├── lib/                      # Shared utility libraries (auth config, upload helpers)
├── public/                   # Static assets (images, logos, icons)
├── package.json              # Project dependencies & scripts
└── tsconfig.json             # TypeScript configuration
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory based on the `.env.example` file:

```env
# Google Sheets Integration
GOOGLE_SHEETS_WEBHOOK_URL=your_webhook_url

# Email Notifications (e.g. Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_TO=recipient@example.com

# Analytics & Marketing Pixel IDs
NEXT_PUBLIC_GA_MEASUREMENT_ID=UA-XXXXXX-X
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id

# Google Ads tracking
NEXT_PUBLIC_GADS_CONVERSION_ID=AW-XXXXXX
NEXT_PUBLIC_GADS_CONVERSION_LABEL=your_gads_label

# Public contact details
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_PHONE_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devashmit/dollarscolony.git
   cd dollarscolony
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file and populate it with the required keys (see above).

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

5. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🛡️ Authentication & Administration

Admin routes are secured using NextAuth.js middleware (`middleware.ts`). Standard users cannot access `/admin/*` views without proper authentication. Check the `auth.config.ts` configuration to modify user providers, credentials validation, or token lifetimes.

---

## 📈 Deployment

Deploy instantly to Vercel:

1. Link your repository on the [Vercel Dashboard](https://vercel.com).
2. Configure all Environment Variables under Project Settings.
3. Deploy! Vercel automatically detects Next.js configurations.

---

## 📄 License & Maintenance

Designed and maintained for **Sri Brahmari Developers & Dollars Colony Kundapura**. All rights reserved.