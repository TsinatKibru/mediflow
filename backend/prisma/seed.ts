import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.appointment.deleteMany();
    await prisma.pharmacyOrder.deleteMany();
    await prisma.medication.deleteMany();
    await prisma.labOrder.deleteMany();
    await prisma.consultation.deleteMany();
    await prisma.vitals.deleteMany();
    await prisma.payments.deleteMany();
    await prisma.coverageRecord.deleteMany();
    await prisma.insurancePolicy.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.visit.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.department.deleteMany();
    await prisma.serviceCatalog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();

    // Create Tenant
    console.log('🏥 Creating tenant...');
    const tenant = await prisma.tenant.create({
        data: {
            name: 'City General Hospital',
            subdomain: 'cityhospital',
        },
    });

    // Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@cityhospital.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Admin',
            role: 'HOSPITAL_ADMIN',
            tenantId: tenant.id,
        },
    });

    // Create Departments
    console.log('🏢 Creating departments...');
    const departmentNames = [
        'Cardiology', 'Neurology', 'Orthopedics',
        'Pediatrics', 'General Medicine', 'Emergency'
    ];
    const departments: any[] = [];
    for (const name of departmentNames) {
        const dept = await prisma.department.create({
            data: { name, tenantId: tenant.id },
        });
        departments.push(dept);
    }

    // Create Doctors with Departments
    console.log('🩺 Creating doctors...');
    const doctor1 = await prisma.user.create({
        data: {
            email: 'house@cityhospital.com',
            password: hashedPassword,
            firstName: 'Gregory',
            lastName: 'House',
            role: 'DOCTOR',
            tenantId: tenant.id,
            departmentId: departments[5].id, // Emergency
        },
    });

    const doctor2 = await prisma.user.create({
        data: {
            email: 'wilson@cityhospital.com',
            password: hashedPassword,
            firstName: 'James',
            lastName: 'Wilson',
            role: 'DOCTOR',
            tenantId: tenant.id,
            departmentId: departments[0].id, // Cardiology
        },
    });

    // Create Patients
    console.log('👥 Creating patients...');
    const patientData = [
        { firstName: 'Jane', lastName: 'Smith', dob: '1985-03-15', gender: 'FEMALE', phone: '+1-555-0101', email: 'jane.smith@email.com' },
        { firstName: 'Robert', lastName: 'Johnson', dob: '1978-07-22', gender: 'MALE', phone: '+1-555-0102', email: 'robert.j@email.com' },
        { firstName: 'Maria', lastName: 'Garcia', dob: '1992-11-08', gender: 'FEMALE', phone: '+1-555-0103', email: 'maria.garcia@email.com' },
        { firstName: 'David', lastName: 'Williams', dob: '1965-05-30', gender: 'MALE', phone: '+1-555-0104', email: 'david.w@email.com' },
        { firstName: 'Emily', lastName: 'Brown', dob: '2000-09-12', gender: 'FEMALE', phone: '+1-555-0105', email: 'emily.brown@email.com' },
        { firstName: 'Michael', lastName: 'Chen', dob: '1990-06-18', gender: 'MALE', phone: '+1-555-0106', email: 'michael.chen@email.com' },
        { firstName: 'Sarah', lastName: 'Martinez', dob: '1988-12-03', gender: 'FEMALE', phone: '+1-555-0107', email: 'sarah.m@email.com' },
        { firstName: 'James', lastName: 'Anderson', dob: '1975-04-25', gender: 'MALE', phone: '+1-555-0108', email: 'james.anderson@email.com' },
        { firstName: 'Lisa', lastName: 'Taylor', dob: '1995-08-14', gender: 'FEMALE', phone: '+1-555-0109', email: 'lisa.taylor@email.com' },
        { firstName: 'Christopher', lastName: 'Lee', dob: '1982-01-30', gender: 'MALE', phone: '+1-555-0110', email: 'chris.lee@email.com' },
        { firstName: 'Amanda', lastName: 'White', dob: '1998-11-22', gender: 'FEMALE', phone: '+1-555-0111', email: 'amanda.white@email.com' },
        { firstName: 'Daniel', lastName: 'Harris', dob: '1970-07-08', gender: 'MALE', phone: '+1-555-0112', email: 'daniel.harris@email.com' },
        { firstName: 'Jennifer', lastName: 'Clark', dob: '1987-03-19', gender: 'FEMALE', phone: '+1-555-0113', email: 'jennifer.clark@email.com' },
        { firstName: 'Thomas', lastName: 'Rodriguez', dob: '1993-09-27', gender: 'MALE', phone: '+1-555-0114', email: 'thomas.r@email.com' },
        { firstName: 'Patricia', lastName: 'Lewis', dob: '1960-05-11', gender: 'FEMALE', phone: '+1-555-0115', email: 'patricia.lewis@email.com' },
    ];
    const patients: any[] = [];
    for (const data of patientData) {
        const p = await prisma.patient.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: new Date(data.dob),
                gender: data.gender as any,
                phone: data.phone,
                email: data.email,
                tenantId: tenant.id,
            },
        });
        patients.push(p);
    }

    // Create Visits with Vitals and Consultations
    console.log('🏥 Creating visits...');

    // Jane Smith - Completed Cardiology Visit
    const visit1 = await prisma.visit.create({
        data: {
            patientId: patients[0].id,
            departmentId: departments[0].id, // Cardiology
            tenantId: tenant.id,
            status: 'COMPLETED',
            reason: 'Annual heart checkup',
            createdAt: new Date('2024-02-01T09:00:00'),
        },
    });

    await prisma.vitals.create({
        data: {
            visitId: visit1.id,
            temperature: 36.8,
            pulse: 72,
            bpSystolic: 120,
            bpDiastolic: 80,
            weight: 65,
            height: 165,
        },
    });

    await prisma.consultation.create({
        data: {
            visitId: visit1.id,
            notes: 'Patient presents with normal cardiac function. ECG shows regular sinus rhythm. Blood pressure within normal range. Recommend continued healthy lifestyle and annual follow-ups.',
            prescription: 'Continue current medications: Aspirin 81mg daily. Maintain low-sodium diet.',
        },
    });

    // Jane Smith - Recent Visit (In Consultation)
    const visit2 = await prisma.visit.create({
        data: {
            patientId: patients[0].id,
            departmentId: departments[4].id, // General Medicine
            tenantId: tenant.id,
            status: 'IN_CONSULTATION',
            reason: 'Flu-like symptoms',
            createdAt: new Date('2024-02-07T14:30:00'),
        },
    });

    await prisma.vitals.create({
        data: {
            visitId: visit2.id,
            temperature: 38.2,
            pulse: 88,
            bpSystolic: 125,
            bpDiastolic: 82,
            weight: 65,
            height: 165,
        },
    });

    // Robert Johnson - Completed Orthopedics Visit
    const visit3 = await prisma.visit.create({
        data: {
            patientId: patients[1].id,
            departmentId: departments[2].id, // Orthopedics
            tenantId: tenant.id,
            status: 'COMPLETED',
            reason: 'Knee pain after jogging',
            createdAt: new Date('2024-01-28T11:00:00'),
        },
    });

    await prisma.vitals.create({
        data: {
            visitId: visit3.id,
            temperature: 37.0,
            pulse: 75,
            bpSystolic: 130,
            bpDiastolic: 85,
            weight: 82,
            height: 178,
        },
    });

    await prisma.consultation.create({
        data: {
            visitId: visit3.id,
            notes: 'Patient reports mild knee pain on right side. Physical examination shows no swelling or redness. Likely minor strain from overexertion. Advised rest and ice therapy.',
            prescription: 'Ibuprofen 400mg as needed for pain. Ice therapy 15 minutes 3x daily. Rest for 1 week.',
        },
    });

    // Maria Garcia - Waiting for Triage
    await prisma.visit.create({
        data: {
            patientId: patients[2].id,
            departmentId: departments[3].id, // Pediatrics
            tenantId: tenant.id,
            status: 'WAITING',
            reason: 'Child vaccination appointment',
            createdAt: new Date('2024-02-08T10:00:00'),
        },
    });

    // David Williams - Registered (Emergency)
    await prisma.visit.create({
        data: {
            patientId: patients[3].id,
            departmentId: departments[5].id, // Emergency
            tenantId: tenant.id,
            status: 'REGISTERED',
            reason: 'Chest pain and shortness of breath',
            createdAt: new Date('2024-02-08T15:45:00'),
        },
    });

    // Emily Brown - Completed Neurology Visit
    const visit6 = await prisma.visit.create({
        data: {
            patientId: patients[4].id,
            departmentId: departments[1].id, // Neurology
            tenantId: tenant.id,
            status: 'COMPLETED',
            reason: 'Recurring headaches',
            createdAt: new Date('2024-01-25T13:00:00'),
        },
    });

    await prisma.vitals.create({
        data: {
            visitId: visit6.id,
            temperature: 36.9,
            pulse: 68,
            bpSystolic: 118,
            bpDiastolic: 78,
            weight: 58,
            height: 162,
        },
    });

    await prisma.consultation.create({
        data: {
            visitId: visit6.id,
            notes: 'Patient reports tension headaches occurring 2-3 times per week. Neurological examination normal. No signs of migraine or serious pathology. Likely stress-related.',
            prescription: 'Acetaminophen 500mg as needed. Recommend stress management techniques and regular sleep schedule.',
        },
    });

    // Additional visits for variety
    const visit7 = await prisma.visit.create({
        data: {
            patientId: patients[1].id,
            departmentId: departments[0].id, // Cardiology
            tenantId: tenant.id,
            status: 'COMPLETED',
            reason: 'Follow-up for high blood pressure',
            createdAt: new Date('2024-01-15T09:30:00'),
        },
    });

    await prisma.vitals.create({
        data: {
            visitId: visit7.id,
            temperature: 37.1,
            pulse: 78,
            bpSystolic: 135,
            bpDiastolic: 88,
            weight: 82,
            height: 178,
        },
    });

    await prisma.consultation.create({
        data: {
            visitId: visit7.id,
            notes: 'Blood pressure still slightly elevated. Patient reports compliance with medication. Recommend lifestyle modifications including reduced salt intake and increased exercise.',
            prescription: 'Lisinopril 10mg daily. Continue monitoring BP at home.',
        },
    });

    // Lab Orders for Visit 1 (Completed Cardiology)
    console.log('🧪 Creating lab orders...');
    const lo1 = await prisma.labOrder.create({
        data: {
            visitId: visit1.id,
            testName: 'Lipid Profile',
            instructions: 'Fasting required for 12 hours',
            status: 'COMPLETED',
            prescribedById: doctor2.id,
            result: 'Total Cholesterol: 185 mg/dL, LDL: 110 mg/dL, HDL: 52 mg/dL',
        }
    });

    await prisma.payments.create({
        data: {
            visitId: visit1.id,
            amountCharged: 350,
            amountPaid: 350,
            method: 'CASH',
            serviceType: 'LABORATORY',
            status: 'COMPLETED',
            labOrderId: lo1.id,
            reason: 'Laboratory Test: Lipid Profile',
        }
    });

    const lo2 = await prisma.labOrder.create({
        data: {
            visitId: visit1.id,
            testName: 'Complete Blood Count (CBC)',
            status: 'COMPLETED',
            prescribedById: doctor2.id,
            result: 'All values within normal ranges.',
        }
    });

    await prisma.payments.create({
        data: {
            visitId: visit1.id,
            amountCharged: 150,
            amountPaid: 150,
            method: 'CASH',
            serviceType: 'LABORATORY',
            status: 'COMPLETED',
            labOrderId: lo2.id,
            reason: 'Laboratory Test: Complete Blood Count (CBC)',
        }
    });

    // Lab Order for Visit 2 (In Consultation)
    const lo3 = await prisma.labOrder.create({
        data: {
            visitId: visit2.id,
            testName: 'Influenza A+B Rapid Test',
            instructions: 'Nasal swab',
            status: 'ORDERED',
            prescribedById: adminUser.id,
        }
    });

    await prisma.payments.create({
        data: {
            visitId: visit2.id,
            amountCharged: 300,
            amountPaid: 0,
            method: 'CASH',
            serviceType: 'LABORATORY',
            status: 'PENDING',
            labOrderId: lo3.id,
            reason: 'Laboratory Test: Influenza A+B Rapid Test',
        }
    });

    console.log('💊 Creating medications...');
    const medicationData = [
        { name: 'Amoxicillin', genericName: 'Amoxicillin', dosageForm: 'Capsule', strength: '500mg', stockBalance: 1000, unitPrice: 0.50 },
        { name: 'Lisinopril', genericName: 'Lisinopril', dosageForm: 'Tablet', strength: '10mg', stockBalance: 500, unitPrice: 0.75 },
        { name: 'Metformin', genericName: 'Metformin', dosageForm: 'Tablet', strength: '850mg', stockBalance: 800, unitPrice: 0.30 },
        { name: 'Paracetamol', genericName: 'Acetaminophen', dosageForm: 'Tablet', strength: '500mg', stockBalance: 2000, unitPrice: 0.10 },
        { name: 'Salbutamol', genericName: 'Albuterol', dosageForm: 'Inhaler', strength: '100mcg', stockBalance: 50, unitPrice: 12.00 },
    ];
    const medications: any[] = [];
    for (const data of medicationData) {
        const med = await prisma.medication.create({
            data: {
                ...data,
                tenantId: tenant.id,
            },
        });
        medications.push(med);
    }

    // Pharmacy Order for Visit 2
    const po1 = await prisma.pharmacyOrder.create({
        data: {
            visitId: visit2.id,
            medicationId: medications[0].id, // Amoxicillin
            quantity: 21,
            instructions: 'Take 1 capsule 3 times daily for 7 days',
            status: 'PENDING',
            prescribedById: adminUser.id,
        },
    });

    await prisma.payments.create({
        data: {
            visitId: visit2.id,
            amountCharged: 10.50, // 0.50 * 21
            amountPaid: 0,
            method: 'CASH',
            serviceType: 'PHARMACY',
            status: 'PENDING',
            pharmacyOrderId: po1.id,
            reason: 'Prescription: Amoxicillin (21 units)',
        }
    });

    // Service Catalog
    console.log('💰 Seeding service price catalog...');
    const catalogItems = await prisma.serviceCatalog.createMany({
        data: [
            // Registration
            { category: 'REGISTRATION', name: 'OPD Registration', code: 'REG-001', price: 50, description: 'Outpatient registration fee', tenantId: tenant.id, isActive: true },
            { category: 'REGISTRATION', name: 'Emergency Registration', code: 'REG-002', price: 100, description: 'Emergency department registration', tenantId: tenant.id, isActive: true },
            // Consultation
            { category: 'CONSULTATION', name: 'General Consultation', code: 'CON-001', price: 200, description: 'General practitioner visit', tenantId: tenant.id, isActive: true },
            { category: 'CONSULTATION', name: 'Specialist Consultation', code: 'CON-002', price: 400, description: 'Department specialist visit', tenantId: tenant.id, isActive: true },
            { category: 'CONSULTATION', name: 'Follow-up Consultation', code: 'CON-003', price: 100, description: 'Follow-up for existing patients', tenantId: tenant.id, isActive: true },
            // Laboratory
            { category: 'LABORATORY', name: 'Complete Blood Count (CBC)', code: 'LAB-001', price: 120, description: 'Full blood count with differential', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Malaria RDT', code: 'LAB-002', price: 80, description: 'Rapid diagnostic test for malaria', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Urinalysis', code: 'LAB-003', price: 60, description: 'Complete urine analysis', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Lipid Profile', code: 'LAB-004', price: 250, description: 'Total cholesterol, LDL, HDL, Triglycerides', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Liver Function Tests (LFT)', code: 'LAB-005', price: 280, description: 'AST, ALT, ALP, Bilirubin', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Thyroid Function Tests (TSH/T4)', code: 'LAB-006', price: 350, description: 'TSH and Free T4 levels', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Fasting Blood Sugar (FBS)', code: 'LAB-007', price: 70, description: 'Fasting glucose level', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'HIV Screening (ELISA)', code: 'LAB-008', price: 100, description: 'HIV 1/2 antibody screening', tenantId: tenant.id, isActive: true },
            { category: 'LABORATORY', name: 'Influenza A+B Rapid Test', code: 'LAB-009', price: 150, description: 'Rapid influenza diagnostic test', tenantId: tenant.id, isActive: true },
            // Procedures
            { category: 'PROCEDURE', name: 'Wound Dressing', code: 'PRO-001', price: 150, description: 'Basic wound cleaning and dressing', tenantId: tenant.id, isActive: true },
            { category: 'PROCEDURE', name: 'Injection / IV Administration', code: 'PRO-002', price: 80, description: 'Intravenous or intramuscular injection', tenantId: tenant.id, isActive: true },
            { category: 'PROCEDURE', name: 'ECG (Electrocardiogram)', code: 'PRO-003', price: 200, description: '12-lead ECG reading', tenantId: tenant.id, isActive: true },
        ]
    });

    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Tenant: ${tenant.name}`);
    console.log(`   Admin: admin@cityhospital.com / admin123`);
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Patients: ${patients.length}`);
    console.log(`   Visits: 7 (with vitals and consultations)`);
    console.log(`   Medications: ${medications.length}`);
    console.log(`   Service Catalog: ${catalogItems.count} items`);
    console.log('\n🔑 Login credentials:');
    console.log(`   Email: admin@cityhospital.com`);
    console.log(`   Password: admin123`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
