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

---

## 📸 App Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Patients
![Patients](./screenshots/patients.png)

### Patient Detail
![Patient Detail](./screenshots/patient-detail.png)

### Patient Detail Visit History
![Patient Detail Visit History](./screenshots/patient-detail-visit-history.png)

### Patient Detail Billing
![Patient Detail Billing](./screenshots/patient-detail-billing.png)

### Patient Detail Add Insurance
![Patient Detail Add Insurance](./screenshots/patient-detail-add-insurance.png)

### Patient Detail Insurance
![Patient Detail Insurance](./screenshots/patient-detail-insurance.png)

### Visits Page
![Visits Page](./screenshots/visits-page.png)

### Visits Clinical View
![Visits Clinical View](./screenshots/visits-clinical-view.png)

### To Be Removed Clinical View
![To Be Removed Clinical View](./screenshots/to-be-removed-clinical-view.png)

### Clinical View Physician Consultation
![Clinical View Physician Consultation](./screenshots/clinical-view-physician-consultation.png)

### Clinical View Laboratory
![Clinical View Laboratory](./screenshots/clinical-view-laboratory.png)

### Clinical View Pharmacy Prescription
![Clinical View Pharmacy Prescription](./screenshots/clinical-view-pharmacy-prescription.png)

### Check In Patient
![Check In Patient](./screenshots/check-in-patient.png)

### New Appointment Creation
![New Appointment Creation](./screenshots/new-appointment-creation.png)

### Doctor Schedule
![Doctor Schedule](./screenshots/doctor-schedule.png)

### Doctor Schedule Repeat
![Doctor Schedule Repeat](./screenshots/doctor-schedule-repeat.png)

### Appointments
![Appointments](./screenshots/appointments.png)

### Pharmacy
![Pharmacy](./screenshots/pharmacy.png)

### Laboratory
![Laboratory](./screenshots/laboratory.png)

### Medication Inventory
![Medication Inventory](./screenshots/medication-inventory.png)

### Billing
![Billing](./screenshots/billing.png)

### Staff Management
![Staff Management](./screenshots/staff-management.png)

### Department Management
![Department Management](./screenshots/department-management.png)

### Settings Profile
![Settings Profile](./screenshots/settings-profile.png)

### Settings Clinics Set Profile
![Settings Clinics Set Profile](./screenshots/settings-clinics-set-profile.png)

### Settings Price List
![Settings Price List](./screenshots/settings-price-list.png)

### Settings Financial
![Settings Financial](./screenshots/settings-financial.png)

### Billing Ledger
![Billing Ledger](./screenshots/billing-ledger.png)

### Billing Printed Receipt
![Billing Printed Receipt](./screenshots/billing-printed-receipt.png)
