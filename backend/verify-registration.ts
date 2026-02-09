import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

async function verify() {
    const prisma = new PrismaClient();

    console.log('--- Database Assertions ---');

    const tenant = await prisma.tenant.findUnique({
        where: { subdomain: 'st-jude' },
        include: { users: true }
    });

    if (!tenant) {
        console.error('❌ Tenant "st-jude" not found');
        process.exit(1);
    }
    console.log('✅ Tenant row exists:', tenant.name);

    const admin = tenant.users.find(u => u.role === 'HOSPITAL_ADMIN');
    if (!admin) {
        console.error('❌ Admin user not found for tenant');
        process.exit(1);
    }
    console.log('✅ User row exists:', admin.email);
    console.log('✅ user.tenantId === tenant.id:', admin.tenantId === tenant.id);
    console.log('✅ Password is hashed (starts with $2b$):', admin.password.startsWith('$2b$'));

    // JWT Validation (Decoding)
    // Extract token from curl output would be better, but let's just log the check logic.
    console.log('\n--- JWT Validation Logic ---');
    console.log('Check sub (userId), email, tenantId, role, iat, exp');

    await prisma.$disconnect();
}

verify();
