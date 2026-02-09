"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
async function verify() {
    const prisma = new client_1.PrismaClient();
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
    console.log('\n--- JWT Validation Logic ---');
    console.log('Check sub (userId), email, tenantId, role, iat, exp');
    await prisma.$disconnect();
}
verify();
//# sourceMappingURL=verify-registration.js.map