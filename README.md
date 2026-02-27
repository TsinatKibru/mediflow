# MediFlow: Premium Hospital Management System

![MediFlow Thumbnail](file:///home/calm/.gemini/antigravity/brain/b06c5768-f873-4a7e-9ff2-500cfeb86915/mediflow_thumbnail_1772195638440.png)

MediFlow is a state-of-the-art, full-stack hospital management system designed for seamless healthcare workflow automation. It features a modern dark-mode dashboard, multi-tenant support, and comprehensive modules for clinical operations, pharmacy, laboratory, and billing.

## 🚀 Key Features

- **Multi-Tenant Architecture**: Supports multiple hospitals/clinics with separate data silos.
- **Clinical Dashboard**: Real-time patient monitoring, vitals, and consultation management.
- **Pharmacy & Lab**: End-to-end order tracking, medication inventory, and test results.
- **Billing & Payments**: Integrated service catalog, automated invoicing, and Stripe payment support.
- **Real-Time Updates**: Powered by Pusher for instant notifications and live updates.
- **Premium UI/UX**: Built with Next.js, Tailwind CSS, and Lucide icons for a sleek, responsive experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS, Vanilla CSS
- **Icons**: Lucide React
- **Real-time**: Pusher JS

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL (Vercel Postgres/Neon)
- **Authentication**: JWT with Passport
- **Real-time**: Pusher
- **Cloud Storage**: Cloudinary (for attachments)

---

## 🏗️ Project Structure

```text
mediflow/
├── frontend/    # Next.js web application
└── backend/     # NestJS API and Database (Prisma)
```

---

## 🚦 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud)

### 1. Setup Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your credentials
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
# Copy .env.example to .env and fill in NEXT_PUBLIC_API_URL
npm run dev
```

---

## 🧪 Testing Credentials (Seeded Data)

The project comes with a comprehensive seed script that populates the database with a test tenant, staff, and patient records.

| Field | Value |
| :--- | :--- |
| **Login URL** | `http://localhost:3000/login` |
| **Tenant Slug** | `cityhospital` |
| **Admin Email** | `admin@cityhospital.com` |
| **Admin Password** | `admin123` |

---

## 🌍 Deployment (Vercel)

MediFlow is configured for serverless deployment on Vercel.

### Backend Configuration
The backend includes a `vercel.json` and a specific serverless entry point (`src/vercel.ts`). 
- **Command**: `npm run vercel-build` (handles prisma generation and build)
- **Environment Variables**: Ensure `DATABASE_URL`, `JWT_SECRET`, and `PUSHER` keys are set in Vercel.

### Frontend Configuration
Standard Next.js deployment.
- **Environment Variables**: Set `NEXT_PUBLIC_API_URL` to point to your backend deployment URL.

---

## 📄 License
This project is licensed under the MIT License.
